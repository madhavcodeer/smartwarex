"""
Route Optimization using Google OR-Tools
"""
import numpy as np
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from typing import List, Tuple, Dict


class RouteOptimizer:
    """Optimize warehouse routes using OR-Tools."""
    
    def __init__(self, grid_width: int, grid_height: int):
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.obstacles = set()
    
    def add_obstacle(self, x: int, y: int):
        """Add an obstacle to the warehouse grid."""
        self.obstacles.add((x, y))
    
    def manhattan_distance(self, point1: Tuple[int, int], point2: Tuple[int, int]) -> int:
        """Calculate Manhattan distance between two points."""
        return abs(point1[0] - point2[0]) + abs(point1[1] - point2[1])
    
    def create_distance_matrix(self, locations: List[Tuple[int, int]]) -> List[List[int]]:
        """
        Create distance matrix for all locations.
        
        Args:
            locations: List of (x, y) coordinates
        
        Returns:
            Distance matrix
        """
        n = len(locations)
        distance_matrix = [[0] * n for _ in range(n)]
        
        for i in range(n):
            for j in range(n):
                if i != j:
                    distance_matrix[i][j] = self.manhattan_distance(locations[i], locations[j])
        
        return distance_matrix
    
    def optimize_picking_route(
        self,
        start_location: Tuple[int, int],
        pick_locations: List[Tuple[int, int]],
        end_location: Tuple[int, int] = None
    ) -> Dict:
        """
        Optimize picking route using OR-Tools TSP solver.
        
        Args:
            start_location: Starting point (e.g., packing station)
            pick_locations: List of locations to visit
            end_location: Optional ending point (defaults to start_location)
        
        Returns:
            Dictionary with optimized route and metrics
        """
        if end_location is None:
            end_location = start_location
        
        # Create list of all locations
        all_locations = [start_location] + pick_locations + [end_location]
        
        # Create distance matrix
        distance_matrix = self.create_distance_matrix(all_locations)
        
        # Create routing model
        manager = pywrapcp.RoutingIndexManager(
            len(distance_matrix),
            1,  # Number of vehicles
            0   # Depot (start location index)
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Create distance callback
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return distance_matrix[from_node][to_node]
        
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Set search parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 5
        
        # Solve
        solution = routing.SolveWithParameters(search_parameters)
        
        if solution:
            # Extract route
            route = []
            route_distance = 0
            index = routing.Start(0)
            
            while not routing.IsEnd(index):
                node = manager.IndexToNode(index)
                route.append(all_locations[node])
                previous_index = index
                index = solution.Value(routing.NextVar(index))
                route_distance += routing.GetArcCostForVehicle(previous_index, index, 0)
            
            # Add final location
            final_node = manager.IndexToNode(index)
            route.append(all_locations[final_node])
            
            return {
                'route': route,
                'total_distance': route_distance,
                'num_locations': len(pick_locations),
                'estimated_time_seconds': route_distance * 5,  # Assume 5 seconds per unit distance
                'optimization_status': 'success'
            }
        else:
            return {
                'route': [],
                'total_distance': 0,
                'optimization_status': 'failed'
            }
    
    def optimize_multi_vehicle_routes(
        self,
        depot: Tuple[int, int],
        pick_locations: List[Tuple[int, int]],
        num_vehicles: int = 3,
        vehicle_capacity: int = 20
    ) -> Dict:
        """
        Optimize routes for multiple vehicles with capacity constraints.
        
        Args:
            depot: Depot location
            pick_locations: List of pick locations
            num_vehicles: Number of vehicles
            vehicle_capacity: Capacity of each vehicle
        
        Returns:
            Dictionary with optimized routes for all vehicles
        """
        # Create list of all locations
        all_locations = [depot] + pick_locations
        
        # Create distance matrix
        distance_matrix = self.create_distance_matrix(all_locations)
        
        # Create demands (assume 1 unit per location)
        demands = [0] + [1] * len(pick_locations)
        
        # Create routing model
        manager = pywrapcp.RoutingIndexManager(
            len(distance_matrix),
            num_vehicles,
            0  # Depot index
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Create distance callback
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return distance_matrix[from_node][to_node]
        
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Add capacity constraint
        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return demands[from_node]
        
        demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,  # null capacity slack
            [vehicle_capacity] * num_vehicles,
            True,  # start cumul to zero
            'Capacity'
        )
        
        # Set search parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.time_limit.seconds = 10
        
        # Solve
        solution = routing.SolveWithParameters(search_parameters)
        
        if solution:
            routes = []
            total_distance = 0
            
            for vehicle_id in range(num_vehicles):
                route = []
                route_distance = 0
                route_load = 0
                index = routing.Start(vehicle_id)
                
                while not routing.IsEnd(index):
                    node = manager.IndexToNode(index)
                    route.append(all_locations[node])
                    route_load += demands[node]
                    previous_index = index
                    index = solution.Value(routing.NextVar(index))
                    route_distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
                
                # Add final location
                final_node = manager.IndexToNode(index)
                route.append(all_locations[final_node])
                
                routes.append({
                    'vehicle_id': vehicle_id,
                    'route': route,
                    'distance': route_distance,
                    'load': route_load,
                    'num_stops': len(route) - 2  # Exclude start and end depot
                })
                
                total_distance += route_distance
            
            return {
                'routes': routes,
                'total_distance': total_distance,
                'num_vehicles_used': sum(1 for r in routes if r['num_stops'] > 0),
                'optimization_status': 'success'
            }
        else:
            return {
                'routes': [],
                'total_distance': 0,
                'optimization_status': 'failed'
            }
    
    def calculate_route_metrics(self, route: List[Tuple[int, int]]) -> Dict:
        """
        Calculate metrics for a given route.
        
        Args:
            route: List of (x, y) coordinates
        
        Returns:
            Dictionary with route metrics
        """
        if len(route) < 2:
            return {
                'total_distance': 0,
                'num_locations': len(route),
                'avg_distance_between_stops': 0
            }
        
        total_distance = 0
        for i in range(len(route) - 1):
            total_distance += self.manhattan_distance(route[i], route[i+1])
        
        return {
            'total_distance': total_distance,
            'num_locations': len(route),
            'avg_distance_between_stops': total_distance / (len(route) - 1)
        }


# Example usage
if __name__ == "__main__":
    # Initialize optimizer
    optimizer = RouteOptimizer(grid_width=50, grid_height=30)
    
    # Define locations
    start = (0, 0)
    picks = [(10, 5), (15, 20), (30, 10), (25, 25), (40, 15), (35, 5)]
    
    # Optimize single vehicle route
    print("Optimizing single vehicle route...")
    result = optimizer.optimize_picking_route(start, picks)
    print(f"Route: {result['route']}")
    print(f"Total distance: {result['total_distance']}")
    print(f"Estimated time: {result['estimated_time_seconds']} seconds")
    
    # Optimize multi-vehicle routes
    print("\nOptimizing multi-vehicle routes...")
    multi_result = optimizer.optimize_multi_vehicle_routes(start, picks, num_vehicles=2, vehicle_capacity=4)
    print(f"Number of vehicles used: {multi_result['num_vehicles_used']}")
    print(f"Total distance: {multi_result['total_distance']}")
    
    for route_info in multi_result['routes']:
        if route_info['num_stops'] > 0:
            print(f"\nVehicle {route_info['vehicle_id']}:")
            print(f"  Stops: {route_info['num_stops']}")
            print(f"  Distance: {route_info['distance']}")
            print(f"  Load: {route_info['load']}")
