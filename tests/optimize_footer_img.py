import os
from PIL import Image

def optimize_image(input_path, output_path, target_width, quality=82):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} does not exist!")
        return False
    try:
        with Image.open(input_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            width, height = img.size
            aspect_ratio = height / width
            target_height = int(target_width * aspect_ratio)
            img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            img_resized.save(output_path, format="JPEG", quality=quality, optimize=True)
            print(f"Successfully saved to {output_path} ({target_width}x{target_height}, ~{os.path.getsize(output_path)//1024}KB)")
            return True
    except Exception as e:
        print(f"Error optimizing {os.path.basename(input_path)}: {e}")
        return False

def main():
    album_dir = "/Users/ethan/Desktop/wedding-template/Hình Album"
    output_dir = "/Users/ethan/Desktop/wedding-template/assets/decor"
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Optimize footer card image
    optimize_image(
        os.path.join(album_dir, "HLE04841.jpg"),
        os.path.join(output_dir, "footer-mung-cuoi.jpg"),
        600,
        quality=82
    )
    
    # 2. Optimize QR Groom
    optimize_image(
        os.path.join(album_dir, "chu-re.jpg"),
        os.path.join(output_dir, "qr-groom.jpg"),
        400,
        quality=80
    )
    
    # 3. Optimize QR Bride
    optimize_image(
        os.path.join(album_dir, "co-dau.jpg"),
        os.path.join(output_dir, "qr-bride.jpg"),
        400,
        quality=80
    )

if __name__ == "__main__":
    main()
