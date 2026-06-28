import os
import shutil
from PIL import Image

def main():
    album_dir = "/Users/ethan/Desktop/wedding-template/Hình Album"
    output_dir = "/Users/ethan/Desktop/wedding-template/assets/gallery"
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Get and sort original images
    exclude_files = {'chu-re.jpg', 'co-dau.jpg', 'hero.jpg'}
    files = [f for f in os.listdir(album_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png')) and f.lower() not in exclude_files]
    files.sort()
    
    print(f"Found {len(files)} files to process.")
    
    # Delete existing gallery images to start fresh
    for f in os.listdir(output_dir):
        if f.lower().startswith("gallery-") and f.lower().endswith((".jpg", ".jpeg")):
            path = os.path.join(output_dir, f)
            print(f"Removing old asset: {f}")
            os.remove(path)
            
    # Process each image
    for idx, filename in enumerate(files, start=1):
        num_str = f"{idx:02d}"
        input_path = os.path.join(album_dir, filename)
        
        # Output paths
        large_path = os.path.join(output_dir, f"gallery-{num_str}.jpg")
        thumb_path = os.path.join(output_dir, f"gallery-{num_str}-thumb.jpg")
        
        print(f"[{idx}/{len(files)}] Processing {filename}...")
        
        try:
            with Image.open(input_path) as img:
                # Convert to RGB (in case of RGBA or CMYK)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                width, height = img.size
                aspect_ratio = height / width
                
                # 1. Save Large Version (1600px width max)
                large_width = min(1600, width)
                large_height = int(large_width * aspect_ratio)
                img_large = img.resize((large_width, large_height), Image.Resampling.LANCZOS)
                img_large.save(large_path, format="JPEG", quality=82, optimize=True)
                
                # 2. Save Thumbnail Version (600px width max)
                thumb_width = min(600, width)
                thumb_height = int(thumb_width * aspect_ratio)
                img_thumb = img.resize((thumb_width, thumb_height), Image.Resampling.LANCZOS)
                img_thumb.save(thumb_path, format="JPEG", quality=78, optimize=True)
                
                print(f"  Saved Large: {large_width}x{large_height} (~{os.path.getsize(large_path)//1024}KB)")
                print(f"  Saved Thumb: {thumb_width}x{thumb_height} (~{os.path.getsize(thumb_path)//1024}KB)")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print("Image optimization completed!")

if __name__ == "__main__":
    main()
