import tensorflow as tf
import numpy as np
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
from PIL import Image
import io

class ProductClassifier:
    def __init__(self):
        # Load pre-trained EfficientNetB0 model with top layer for classification
        self.model = EfficientNetB0(weights='imagenet', include_top=True)
        print("EfficientNetB0 model loaded successfully (with classification head).")
        
        # Expanded and categorized keyword lists for better classification
        self.soft_keywords = {
            # Textiles and fabrics
            'cloth', 'velvet', 'wool', 'cotton', 'silk', 'linen', 'nylon', 'polyester', 
            'fabric', 'textile', 'canvas', 'denim', 'fleece', 'leather',
            
            # Bedding and home textiles
            'pillow', 'cushion', 'quilt', 'blanket', 'towel', 'sheet', 'duvet', 'comforter',
            'mattress', 'rug', 'carpet', 'curtain', 'drape',
            
            # Apparel
            'jersey', 'shirt', 'pants', 'jeans', 'dress', 'skirt', 'jacket', 'coat', 
            'sweater', 'cardigan', 'vest', 'suit', 'apparel', 'garment', 'clothing',
            'sock', 'stocking', 'glove', 'mitten', 'scarf', 'tie', 'bonnet', 'hat', 'cap',
            'shoe', 'boot', 'sneaker', 'sandal', 'slipper', 'underwear', 'bra', 'shorts',
            'hoodie', 'sweatshirt', 'tshirt', 't-shirt', 'polo', 'blouse', 'kimono',
            
            # Soft toys and plush
            'teddy', 'bear', 'plush', 'toy', 'doll', 'stuffed', 'puppet',
            
            # Accessories
            'handkerchief', 'diaper', 'bib', 'bag', 'purse', 'backpack', 'wallet',
            'belt', 'bandana', 'headband'
        }
        
        self.hard_keywords = {
            # Electronics
            'computer', 'laptop', 'phone', 'tablet', 'monitor', 'screen', 'keyboard',
            'mouse', 'camera', 'television', 'radio', 'speaker', 'headphone', 'earphone',
            'console', 'controller', 'remote', 'charger', 'adapter', 'router', 'modem',
            
            # Appliances
            'refrigerator', 'microwave', 'oven', 'toaster', 'blender', 'mixer', 'iron',
            'vacuum', 'washer', 'dryer', 'dishwasher', 'fan', 'heater', 'conditioner',
            
            # Tools and hardware
            'tool', 'hammer', 'drill', 'saw', 'wrench', 'screwdriver', 'plier',
            'nail', 'screw', 'bolt', 'nut', 'lock', 'key', 'chain',
            
            # Glassware and ceramics
            'glass', 'bottle', 'jar', 'vase', 'cup', 'mug', 'plate', 'bowl', 'dish',
            'ceramic', 'porcelain', 'pottery', 'china',
            
            # Furniture and fixtures
            'table', 'chair', 'desk', 'shelf', 'cabinet', 'drawer', 'lamp', 'light',
            'frame', 'mirror', 'clock', 'stand',
            
            # Sports equipment (hard)
            'ball', 'bat', 'racket', 'club', 'helmet', 'skateboard', 'bicycle', 'bike',
            
            # Musical instruments
            'guitar', 'piano', 'drum', 'violin', 'trumpet', 'flute', 'saxophone',
            
            # Miscellaneous hard items
            'book', 'pen', 'pencil', 'ruler', 'scissors', 'stapler', 'calculator',
            'watch', 'sunglasses', 'umbrella', 'can', 'container', 'box'
        }

    def preprocess_image(self, img_bytes):
        """Preprocess image for EfficientNet model"""
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        return img_array

    def classify_object(self, label_name, confidence):
        """
        Classify an object as soft or hard with a nuanced score.
        Returns: (is_soft, hardness_score, match_strength)
        """
        normalized_label = label_name.lower().replace('_', ' ')
        
        # Check for soft keywords
        soft_matches = [kw for kw in self.soft_keywords if kw in normalized_label]
        hard_matches = [kw for kw in self.hard_keywords if kw in normalized_label]
        
        # Calculate match strength
        soft_strength = len(soft_matches)
        hard_strength = len(hard_matches)
        
        # Determine classification
        if soft_strength > hard_strength:
            is_soft = True
            # Hardness score: lower for soft items (0.1-0.4 range)
            hardness_score = max(0.1, 0.4 - (soft_strength * 0.05))
            match_strength = soft_strength
        elif hard_strength > soft_strength:
            is_soft = False
            # Hardness score: higher for hard items (0.6-0.95 range)
            hardness_score = min(0.95, 0.6 + (hard_strength * 0.05))
            match_strength = hard_strength
        else:
            # No clear match or equal matches - use heuristics
            # Default to hard for safety (more protective handling)
            is_soft = False
            hardness_score = 0.5  # Neutral score
            match_strength = 0
        
        return is_soft, hardness_score, match_strength

    def predict(self, img_bytes):
        """
        Predict product classification with improved accuracy.
        Uses top-5 predictions and weighted scoring for better results.
        """
        try:
            processed_img = self.preprocess_image(img_bytes)
            
            # Get predictions from the model
            preds = self.model.predict(processed_img, verbose=0)
            
            # Decode top 5 predictions for better analysis
            decoded_preds = decode_predictions(preds, top=5)[0]
            
            # Analyze all top predictions with weighted scoring
            weighted_soft_score = 0.0
            weighted_hard_score = 0.0
            weighted_hardness = 0.0
            total_weight = 0.0
            
            classification_details = []
            
            for idx, (class_id, label_name, conf) in enumerate(decoded_preds):
                # Weight decreases for lower-ranked predictions
                weight = conf * (1.0 - idx * 0.15)  # Top prediction has full weight
                
                is_soft, hardness_score, match_strength = self.classify_object(label_name, conf)
                
                if is_soft:
                    weighted_soft_score += weight
                else:
                    weighted_hard_score += weight
                
                weighted_hardness += hardness_score * weight
                total_weight += weight
                
                classification_details.append({
                    'label': label_name,
                    'confidence': float(conf),
                    'is_soft': is_soft,
                    'hardness': hardness_score,
                    'match_strength': match_strength
                })
            
            # Normalize weighted scores
            if total_weight > 0:
                weighted_soft_score /= total_weight
                weighted_hard_score /= total_weight
                weighted_hardness /= total_weight
            
            # Final classification based on weighted analysis
            is_soft_final = weighted_soft_score > weighted_hard_score
            
            # Get primary detected object (top prediction)
            top_pred = decoded_preds[0]
            primary_label = top_pred[1]
            primary_confidence = float(top_pred[2])
            
            # Adjust confidence based on prediction agreement
            # If top predictions agree, confidence is higher
            agreement_score = max(weighted_soft_score, weighted_hard_score)
            calibrated_confidence = primary_confidence * (0.7 + 0.3 * agreement_score)
            
            # Final classification
            classification = "Soft" if is_soft_final else "Hard"
            
            # Determine fragility based on hardness score and object type
            if weighted_hardness < 0.3:
                fragility_class = "Low"
            elif weighted_hardness < 0.7:
                fragility_class = "Medium"
            else:
                fragility_class = "High"
            
            # Recommended Zone based on classification and fragility
            if is_soft_final:
                if fragility_class == "Low":
                    zone = "Zone B (Apparel/Softlines - Standard)"
                else:
                    zone = "Zone B (Apparel/Softlines - Delicate)"
            else:
                if fragility_class == "High":
                    zone = "Zone A (Hardlines/Secure - Fragile)"
                else:
                    zone = "Zone A (Hardlines/Secure - Standard)"
            
            # Detailed handling instructions
            if is_soft_final:
                if fragility_class == "Low":
                    instructions = "Keep dry and clean. Stackable. Avoid sharp objects and excessive compression."
                else:
                    instructions = "Keep dry and clean. Handle gently. Avoid folding or compressing. Store flat if possible."
            else:
                if fragility_class == "High":
                    instructions = "FRAGILE: Handle with extreme care. Do not drop or impact. Use protective packaging. Keep away from moisture."
                elif fragility_class == "Medium":
                    instructions = "Handle with care. Avoid dropping. Protect from impacts and moisture."
                else:
                    instructions = "Handle normally. Protect from excessive impacts. Keep in designated storage area."
            
            # Build comprehensive result
            result = {
                "classification": classification,
                "detected_object": primary_label.replace('_', ' ').title(),
                "hardness_score": round(float(weighted_hardness), 3),
                "confidence": round(float(calibrated_confidence), 3),
                "fragility_class": fragility_class,
                "recommended_zone": zone,
                "handling_instructions": instructions,
                # Additional analysis details
                "analysis_details": {
                    "top_predictions": [
                        {
                            "object": detail['label'].replace('_', ' ').title(),
                            "confidence": round(float(detail['confidence']), 3),
                            "type": "Soft" if detail['is_soft'] else "Hard"
                        }
                        for detail in classification_details[:3]  # Top 3
                    ],
                    "soft_likelihood": round(float(weighted_soft_score), 3),
                    "hard_likelihood": round(float(weighted_hard_score), 3),
                    "agreement_score": round(float(agreement_score), 3)
                }
            }
            
            return result
            
        except Exception as e:
            print(f"Error during prediction: {e}")
            import traceback
            traceback.print_exc()
            
            # Fallback with error details
            return {
                "classification": "Unknown",
                "detected_object": "Error - Unable to analyze",
                "hardness_score": 0.5,
                "confidence": 0.0,
                "fragility_class": "Medium",
                "recommended_zone": "Zone C (Manual Inspection Required)",
                "handling_instructions": "Unable to analyze automatically. Please inspect manually and classify based on visual assessment.",
                "analysis_details": {
                    "error": str(e),
                    "top_predictions": [],
                    "soft_likelihood": 0.0,
                    "hard_likelihood": 0.0,
                    "agreement_score": 0.0
                }
            }

# Singleton instance
classifier = ProductClassifier()
