"""
Warehouse Layout Optimization using K-Means Clustering
"""
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple
import matplotlib.pyplot as plt
import seaborn as sns


class WarehouseLayoutOptimizer:
    """Optimize warehouse layout using clustering algorithms."""
    
    def __init__(self, grid_width: int, grid_height: int):
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.scaler = StandardScaler()
    
    def analyze_movement_patterns(self, movement_data: pd.DataFrame) -> Dict:
        """
        Analyze item movement patterns to identify hotspots.
        
        Args:
            movement_data: DataFrame with columns [item_id, from_x, from_y, to_x, to_y, frequency]
        
        Returns:
            Dictionary with analysis results
        """
        # Calculate movement frequency for each location
        location_freq = {}
        
        for _, row in movement_data.iterrows():
            from_loc = (row['from_x'], row['from_y'])
            to_loc = (row['to_x'], row['to_y'])
            freq = row['frequency']
            
            location_freq[from_loc] = location_freq.get(from_loc, 0) + freq
            location_freq[to_loc] = location_freq.get(to_loc, 0) + freq
        
        # Create heatmap data
        heatmap = np.zeros((self.grid_height, self.grid_width))
        for (x, y), freq in location_freq.items():
            if 0 <= x < self.grid_width and 0 <= y < self.grid_height:
                heatmap[y, x] = freq
        
        return {
            'heatmap': heatmap,
            'hotspots': sorted(location_freq.items(), key=lambda x: x[1], reverse=True)[:10],
            'total_movements': movement_data['frequency'].sum()
        }
    
    def cluster_items(self, item_data: pd.DataFrame, n_clusters: int = 5) -> Dict:
        """
        Cluster items based on movement patterns and characteristics.
        
        Args:
            item_data: DataFrame with columns [item_id, x, y, movement_freq, category_encoded]
            n_clusters: Number of clusters
        
        Returns:
            Dictionary with clustering results
        """
        # Prepare features
        features = item_data[['x', 'y', 'movement_freq', 'category_encoded']].values
        features_scaled = self.scaler.fit_transform(features)
        
        # Apply K-Means clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(features_scaled)
        
        item_data['cluster'] = clusters
        
        # Calculate cluster statistics
        cluster_stats = []
        for i in range(n_clusters):
            cluster_items = item_data[item_data['cluster'] == i]
            stats = {
                'cluster_id': i,
                'item_count': len(cluster_items),
                'avg_movement_freq': cluster_items['movement_freq'].mean(),
                'center_x': cluster_items['x'].mean(),
                'center_y': cluster_items['y'].mean()
            }
            cluster_stats.append(stats)
        
        return {
            'clusters': clusters,
            'cluster_stats': cluster_stats,
            'item_data': item_data,
            'inertia': kmeans.inertia_
        }
    
    def detect_anomalies(self, item_data: pd.DataFrame, eps: float = 0.5, min_samples: int = 5) -> Dict:
        """
        Detect anomalous item placements using DBSCAN.
        
        Args:
            item_data: DataFrame with item locations and features
            eps: DBSCAN epsilon parameter
            min_samples: DBSCAN min_samples parameter
        
        Returns:
            Dictionary with anomaly detection results
        """
        features = item_data[['x', 'y', 'movement_freq']].values
        features_scaled = self.scaler.fit_transform(features)
        
        dbscan = DBSCAN(eps=eps, min_samples=min_samples)
        labels = dbscan.fit_predict(features_scaled)
        
        # Identify anomalies (label = -1)
        anomalies = item_data[labels == -1]
        
        return {
            'anomalies': anomalies,
            'anomaly_count': len(anomalies),
            'normal_count': len(item_data) - len(anomalies)
        }
    
    def optimize_layout(self, current_layout: pd.DataFrame, movement_data: pd.DataFrame) -> Dict:
        """
        Generate optimized layout recommendations.
        
        Args:
            current_layout: Current item positions
            movement_data: Historical movement data
        
        Returns:
            Dictionary with optimization recommendations
        """
        # Analyze current performance
        movement_analysis = self.analyze_movement_patterns(movement_data)
        
        # Cluster items
        clustering_result = self.cluster_items(current_layout, n_clusters=5)
        
        # Calculate current average picking time (simplified)
        current_avg_distance = self._calculate_avg_picking_distance(current_layout, movement_data)
        
        # Generate recommendations: move high-frequency items closer to shipping zone
        recommendations = []
        high_freq_items = current_layout.nlargest(20, 'movement_freq')
        
        for _, item in high_freq_items.iterrows():
            # Recommend moving to zone closer to (0, 0) - assuming shipping zone
            recommended_x = min(item['x'], self.grid_width // 4)
            recommended_y = min(item['y'], self.grid_height // 4)
            
            if recommended_x != item['x'] or recommended_y != item['y']:
                recommendations.append({
                    'item_id': item['item_id'],
                    'current_location': (item['x'], item['y']),
                    'recommended_location': (recommended_x, recommended_y),
                    'expected_improvement': self._estimate_improvement(item, recommended_x, recommended_y)
                })
        
        # Estimate new average picking time
        estimated_new_distance = current_avg_distance * 0.7  # Simplified estimation
        improvement = ((current_avg_distance - estimated_new_distance) / current_avg_distance) * 100
        
        return {
            'current_avg_picking_distance': current_avg_distance,
            'estimated_new_distance': estimated_new_distance,
            'improvement_percentage': improvement,
            'recommendations': recommendations,
            'heatmap': movement_analysis['heatmap'],
            'clustering': clustering_result
        }
    
    def _calculate_avg_picking_distance(self, layout: pd.DataFrame, movements: pd.DataFrame) -> float:
        """Calculate average picking distance."""
        total_distance = 0
        total_picks = 0
        
        for _, move in movements.iterrows():
            distance = abs(move['to_x'] - move['from_x']) + abs(move['to_y'] - move['from_y'])
            total_distance += distance * move['frequency']
            total_picks += move['frequency']
        
        return total_distance / total_picks if total_picks > 0 else 0
    
    def _estimate_improvement(self, item: pd.Series, new_x: int, new_y: int) -> float:
        """Estimate improvement from relocating an item."""
        current_distance = abs(item['x']) + abs(item['y'])
        new_distance = abs(new_x) + abs(new_y)
        return ((current_distance - new_distance) / current_distance) * 100 if current_distance > 0 else 0
    
    def visualize_heatmap(self, heatmap: np.ndarray, save_path: str = None):
        """Visualize movement heatmap."""
        plt.figure(figsize=(12, 8))
        sns.heatmap(heatmap, cmap='YlOrRd', annot=False, fmt='d', cbar_kws={'label': 'Movement Frequency'})
        plt.title('Warehouse Movement Heatmap')
        plt.xlabel('X Coordinate')
        plt.ylabel('Y Coordinate')
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()
    
    def visualize_clusters(self, item_data: pd.DataFrame, save_path: str = None):
        """Visualize item clusters."""
        plt.figure(figsize=(12, 8))
        scatter = plt.scatter(
            item_data['x'],
            item_data['y'],
            c=item_data['cluster'],
            s=item_data['movement_freq'] * 10,
            alpha=0.6,
            cmap='viridis'
        )
        plt.colorbar(scatter, label='Cluster')
        plt.title('Warehouse Item Clustering')
        plt.xlabel('X Coordinate')
        plt.ylabel('Y Coordinate')
        plt.grid(True, alpha=0.3)
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()


# Example usage
if __name__ == "__main__":
    # Create sample data
    np.random.seed(42)
    
    # Sample movement data
    movement_data = pd.DataFrame({
        'item_id': np.random.randint(1, 100, 500),
        'from_x': np.random.randint(0, 50, 500),
        'from_y': np.random.randint(0, 30, 500),
        'to_x': np.random.randint(0, 50, 500),
        'to_y': np.random.randint(0, 30, 500),
        'frequency': np.random.randint(1, 100, 500)
    })
    
    # Sample item data
    item_data = pd.DataFrame({
        'item_id': range(1, 101),
        'x': np.random.randint(0, 50, 100),
        'y': np.random.randint(0, 30, 100),
        'movement_freq': np.random.randint(1, 100, 100),
        'category_encoded': np.random.randint(0, 5, 100)
    })
    
    # Initialize optimizer
    optimizer = WarehouseLayoutOptimizer(grid_width=50, grid_height=30)
    
    # Run optimization
    results = optimizer.optimize_layout(item_data, movement_data)
    
    print(f"Current Average Picking Distance: {results['current_avg_picking_distance']:.2f}")
    print(f"Estimated New Distance: {results['estimated_new_distance']:.2f}")
    print(f"Improvement: {results['improvement_percentage']:.2f}%")
    print(f"Number of Recommendations: {len(results['recommendations'])}")
