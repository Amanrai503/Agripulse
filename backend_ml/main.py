import os
os.environ["TQDM_DISABLE"] = "1"
import torch
from transformers import MobileNetV2ImageProcessor, MobileNetV2ForImageClassification
from PIL import Image

def scan_disease(image_path, model_path):
    processor = MobileNetV2ImageProcessor.from_pretrained(model_path, local_files_only=True)
    model = MobileNetV2ForImageClassification.from_pretrained(model_path, local_files_only=True)
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    predicted_label_num = logits.argmax(-1).item()
    confidence = torch.nn.functional.softmax(logits, dim=-1)
    confidence_score = round(confidence[0][predicted_label_num].item() * 100, 2)
    label_name = model.config.id2label[predicted_label_num]
    return label_name, confidence_score

if __name__ == "__main__":
    model_path = "./my_model"
    img_path = "plant.png"
    label, confidence = scan_disease(img_path, model_path)
    print(f"Result: {label} ({confidence}%)")