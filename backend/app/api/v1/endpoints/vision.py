from fastapi import APIRouter, UploadFile, File, HTTPException
# Trigger reload
from typing import Any
import sys
import os

# Add ml-engine to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../ml-engine")))

from models.vision.product_classifier import classifier

router = APIRouter()

@router.post("/scan", response_model=dict)
async def scan_product(file: UploadFile = File(...)) -> Any:
    """
    Scan a product image and classify it as Hard or Soft.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    result = classifier.predict(contents)
    
    if not result:
        raise HTTPException(status_code=500, detail="Failed to process image")
        
    return result
