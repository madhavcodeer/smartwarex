"""
Test script for Product Classifier
Tests the vision model with sample images to verify classification accuracy
"""

import sys
import os
from pathlib import Path

# Add parent directory to path to import from ml-engine
parent_dir = Path(__file__).parent.parent
ml_engine_dir = parent_dir / "ml-engine"
sys.path.insert(0, str(parent_dir))
sys.path.insert(0, str(ml_engine_dir))

from models.vision.product_classifier import ProductClassifier
import requests
from io import BytesIO
from PIL import Image
import json


def test_with_url(classifier, url, expected_type=None):
    """Test classifier with an image URL"""
    print(f"\n{'='*80}")
    print(f"Testing: {url}")
    print(f"Expected: {expected_type if expected_type else 'Unknown'}")
    print(f"{'='*80}")
    
    try:
        # Download image
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        img_bytes = response.content
        
        # Get image info
        img = Image.open(BytesIO(img_bytes))
        print(f"Image size: {img.size}, Mode: {img.mode}")
        
        # Classify
        result = classifier.predict(img_bytes)
        
        # Display results
        print(f"\n📦 CLASSIFICATION RESULTS:")
        print(f"   Classification: {result['classification']}")
        print(f"   Detected Object: {result['detected_object']}")
        print(f"   Hardness Score: {result['hardness_score']}")
        print(f"   Confidence: {result['confidence']:.1%}")
        print(f"   Fragility: {result['fragility_class']}")
        print(f"   Recommended Zone: {result['recommended_zone']}")
        print(f"\n📋 Handling Instructions:")
        print(f"   {result['handling_instructions']}")
        
        print(f"\n🔍 Analysis Details:")
        details = result['analysis_details']
        print(f"   Top Predictions:")
        for pred in details['top_predictions']:
            print(f"      - {pred['object']}: {pred['confidence']:.1%} ({pred['type']})")
        print(f"   Soft Likelihood: {details['soft_likelihood']:.1%}")
        print(f"   Hard Likelihood: {details['hard_likelihood']:.1%}")
        print(f"   Agreement Score: {details['agreement_score']:.1%}")
        
        # Verify if matches expected
        if expected_type:
            is_correct = result['classification'] == expected_type
            status = "✅ CORRECT" if is_correct else "❌ INCORRECT"
            print(f"\n{status}")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_with_local_file(classifier, filepath, expected_type=None):
    """Test classifier with a local image file"""
    print(f"\n{'='*80}")
    print(f"Testing local file: {filepath}")
    print(f"Expected: {expected_type if expected_type else 'Unknown'}")
    print(f"{'='*80}")
    
    try:
        with open(filepath, 'rb') as f:
            img_bytes = f.read()
        
        # Get image info
        img = Image.open(filepath)
        print(f"Image size: {img.size}, Mode: {img.mode}")
        
        # Classify
        result = classifier.predict(img_bytes)
        
        # Display results (same as URL test)
        print(f"\n📦 CLASSIFICATION RESULTS:")
        print(f"   Classification: {result['classification']}")
        print(f"   Detected Object: {result['detected_object']}")
        print(f"   Hardness Score: {result['hardness_score']}")
        print(f"   Confidence: {result['confidence']:.1%}")
        print(f"   Fragility: {result['fragility_class']}")
        print(f"   Recommended Zone: {result['recommended_zone']}")
        print(f"\n📋 Handling Instructions:")
        print(f"   {result['handling_instructions']}")
        
        print(f"\n🔍 Analysis Details:")
        details = result['analysis_details']
        print(f"   Top Predictions:")
        for pred in details['top_predictions']:
            print(f"      - {pred['object']}: {pred['confidence']:.1%} ({pred['type']})")
        
        if expected_type:
            is_correct = result['classification'] == expected_type
            status = "✅ CORRECT" if is_correct else "❌ INCORRECT"
            print(f"\n{status}")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def main():
    print("="*80)
    print("PRODUCT CLASSIFIER TEST SUITE")
    print("="*80)
    
    # Initialize classifier
    print("\n🔧 Initializing classifier...")
    classifier = ProductClassifier()
    print("✅ Classifier initialized successfully!")
    
    # Test cases with sample images
    test_cases = [
        # Soft items
        {
            "url": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
            "expected": "Soft",
            "description": "T-shirt (clothing)"
        },
        {
            "url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
            "expected": "Hard",
            "description": "Sofa/furniture"
        },
        {
            "url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "expected": "Hard",
            "description": "Watch (hard accessory)"
        },
        {
            "url": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
            "expected": "Soft",
            "description": "Sneakers (footwear)"
        },
        {
            "url": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
            "expected": "Soft",
            "description": "Pillow (soft home goods)"
        },
    ]
    
    results = []
    correct = 0
    total = 0
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n\n{'#'*80}")
        print(f"TEST CASE {i}/{len(test_cases)}: {test_case['description']}")
        print(f"{'#'*80}")
        
        result = test_with_url(
            classifier,
            test_case['url'],
            test_case['expected']
        )
        
        if result:
            results.append({
                'description': test_case['description'],
                'expected': test_case['expected'],
                'actual': result['classification'],
                'confidence': result['confidence'],
                'detected_object': result['detected_object']
            })
            
            total += 1
            if result['classification'] == test_case['expected']:
                correct += 1
    
    # Summary
    print(f"\n\n{'='*80}")
    print("TEST SUMMARY")
    print(f"{'='*80}")
    print(f"Total Tests: {total}")
    print(f"Correct: {correct}")
    print(f"Incorrect: {total - correct}")
    print(f"Accuracy: {(correct/total*100):.1f}%" if total > 0 else "N/A")
    
    print(f"\n{'='*80}")
    print("DETAILED RESULTS")
    print(f"{'='*80}")
    for i, r in enumerate(results, 1):
        status = "✅" if r['expected'] == r['actual'] else "❌"
        print(f"{i}. {status} {r['description']}")
        print(f"   Expected: {r['expected']}, Got: {r['actual']} ({r['confidence']:.1%})")
        print(f"   Detected as: {r['detected_object']}")
    
    print(f"\n{'='*80}")
    print("TEST COMPLETE")
    print(f"{'='*80}")


if __name__ == "__main__":
    # Check if a custom image path was provided
    if len(sys.argv) > 1:
        print("="*80)
        print("CUSTOM IMAGE TEST")
        print("="*80)
        
        classifier = ProductClassifier()
        image_path = sys.argv[1]
        expected = sys.argv[2] if len(sys.argv) > 2 else None
        
        test_with_local_file(classifier, image_path, expected)
    else:
        # Run full test suite
        main()
