import { useState, useEffect, useRef } from "react";

const FileUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [colors, setColors] = useState(new Set<string>());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: any) => {
    if (e.target.files[0]) {
      const reader: any = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && selectedImage) {
      const context = canvas.getContext("2d");
      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context?.drawImage(image, 0, 0);

        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData?.data;

        const colorsSet = new Set<string>();
    if(pixelData)
        for (let i = 0; i < pixelData.length; i += 4) {
          const r = pixelData[i];
          const g = pixelData[i + 1];
          const b = pixelData[i + 2];
          const hexCode = rgbToHex(r, g, b);

          colorsSet.add(hexCode);
        }

        setColors(colorsSet);
      };

      image.src = selectedImage;
    }
  }, [selectedImage]);

  function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const colorArray = Array.from(colors).map((color) => (
    <div className="rounded-lg">
      <div className="w-20 h-20" style={{ backgroundColor: color }}></div>
      <p className="font-semibold">{color}</p>
    </div>
  ));

  return (
    <div className="mt-20 flex justify-center">
      <input type="file" onChange={handleFileUpload} />
      <br />
      {selectedImage && (
        <div>
          <canvas
            style={{ border: "1px solid black" }}
            ref={canvasRef}
          />
          <div className="flex justify-center flex-wrap">
            {colorArray}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;