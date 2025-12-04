"""
Simple test for Product Classifier - Quick verification
"""

import sys
from pathlib import Path

# Add parent directory to path
parent_dir = Path(__file__).parent.parent
ml_engine_dir = parent_dir / "ml-engine"
sys.path.insert(0, str(parent_dir))
sys.path.insert(0, str(ml_engine_dir))

print("="*80)
print("SIMPLE CLASSIFIER TEST")
print("="*80)

try:
    print("\n1. Importing classifier...")
    from models.vision.product_classifier import ProductClassifier
    print("   ✅ Import successful!")
    
    print("\n2. Initializing classifier...")
    classifier = ProductClassifier()
    print("   ✅ Classifier initialized!")
    
    print("\n3. Testing with a sample URL...")
    import requests
    from io import BytesIO
    
    # Test with a simple image
    test_url = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400"
    print(f"   Downloading: {test_url}")
    
    response = requests.get(test_url, timeout=10)
    img_bytes = response.content
    print(f"   ✅ Image downloaded ({len(img_bytes)} bytes)")
    
    print("\n4. Running classification...")
    result = classifier.predict(img_bytes)
    print("   ✅ Classification complete!")
    
    print("\n" + "="*80)
    print("RESULTS")
    print("="*80)
    print(f"Classification: {result['classification']}")
    print(f"Detected Object: {result['detected_object']}")
    print(f"Hardness Score: {result['hardness_score']}")
    print(f"Confidence: {result['confidence']:.1%}")
    print(f"Fragility: {result['fragility_class']}")
    print(f"Zone: {result['recommended_zone']}")
    print(f"\nInstructions: {result['handling_instructions']}")
    
    print("\n" + "="*80)
    print("✅ TEST PASSED!")
    print("="*80)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
