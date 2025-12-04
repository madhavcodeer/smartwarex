"""
Interactive Product Classifier CLI
Quick tool to test images from command line or interactively
"""

import sys
from pathlib import Path

# Add parent directory to path
parent_dir = Path(__file__).parent.parent
ml_engine_dir = parent_dir / "ml-engine"
sys.path.insert(0, str(parent_dir))
sys.path.insert(0, str(ml_engine_dir))

from models.vision.product_classifier import ProductClassifier
import requests
from io import BytesIO
from PIL import Image


def print_result(result):
    """Pretty print classification result"""
    print("\n" + "="*80)
    print("📦 CLASSIFICATION RESULT")
    print("="*80)
    
    # Main classification
    emoji = "🧸" if result['classification'] == "Soft" else "🔧"
    print(f"\n{emoji} Type: {result['classification']}")
    print(f"🏷️  Detected: {result['detected_object']}")
    print(f"💪 Hardness: {result['hardness_score']:.2f}")
    print(f"✅ Confidence: {result['confidence']:.1%}")
    print(f"⚠️  Fragility: {result['fragility_class']}")
    
    # Zone recommendation
    print(f"\n📍 RECOMMENDED ZONE")
    print(f"   {result['recommended_zone']}")
    
    # Handling instructions
    print(f"\n📋 HANDLING INSTRUCTIONS")
    print(f"   {result['handling_instructions']}")
    
    # Analysis details
    print(f"\n🔍 ANALYSIS DETAILS")
    details = result['analysis_details']
    print(f"   Top Predictions:")
    for i, pred in enumerate(details['top_predictions'], 1):
        print(f"      {i}. {pred['object']}: {pred['confidence']:.1%} ({pred['type']})")
    
    print(f"\n   Likelihood Scores:")
    print(f"      Soft: {details['soft_likelihood']:.1%}")
    print(f"      Hard: {details['hard_likelihood']:.1%}")
    print(f"      Agreement: {details['agreement_score']:.1%}")
    
    print("\n" + "="*80)


def classify_url(classifier, url):
    """Classify image from URL"""
    print(f"\n🌐 Downloading image from URL...")
    print(f"   {url}")
    
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        img_bytes = response.content
        
        # Show image info
        img = Image.open(BytesIO(img_bytes))
        print(f"   ✅ Downloaded: {img.size[0]}x{img.size[1]} pixels, {img.mode} mode")
        
        print(f"\n🤖 Analyzing image...")
        result = classifier.predict(img_bytes)
        print_result(result)
        return result
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None


def classify_file(classifier, filepath):
    """Classify local image file"""
    print(f"\n📁 Loading local file...")
    print(f"   {filepath}")
    
    try:
        # Check if file exists
        if not Path(filepath).exists():
            print(f"   ❌ File not found!")
            return None
        
        with open(filepath, 'rb') as f:
            img_bytes = f.read()
        
        # Show image info
        img = Image.open(filepath)
        print(f"   ✅ Loaded: {img.size[0]}x{img.size[1]} pixels, {img.mode} mode")
        
        print(f"\n🤖 Analyzing image...")
        result = classifier.predict(img_bytes)
        print_result(result)
        return result
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def interactive_mode(classifier):
    """Interactive mode - keep asking for images"""
    print("\n" + "="*80)
    print("🎯 INTERACTIVE MODE")
    print("="*80)
    print("\nEnter image paths or URLs to classify.")
    print("Type 'quit' or 'exit' to stop.\n")
    
    while True:
        try:
            user_input = input("📸 Image (path or URL): ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("\n👋 Goodbye!")
                break
            
            if not user_input:
                continue
            
            # Determine if URL or file path
            if user_input.startswith('http://') or user_input.startswith('https://'):
                classify_url(classifier, user_input)
            else:
                classify_file(classifier, user_input)
            
            print("\n" + "-"*80)
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")


def main():
    print("="*80)
    print("🔬 PRODUCT CLASSIFIER CLI")
    print("="*80)
    
    # Initialize classifier
    print("\n🔧 Initializing classifier...")
    try:
        classifier = ProductClassifier()
        print("✅ Classifier ready!")
    except Exception as e:
        print(f"❌ Failed to initialize: {e}")
        sys.exit(1)
    
    # Check command line arguments
    if len(sys.argv) > 1:
        # Command line mode
        image_input = sys.argv[1]
        
        if image_input.startswith('http://') or image_input.startswith('https://'):
            classify_url(classifier, image_input)
        else:
            classify_file(classifier, image_input)
    else:
        # Interactive mode
        interactive_mode(classifier)


if __name__ == "__main__":
    main()
