import type React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

// Simple XOR encryption function
const encrypt = (data: string, key: string): string => {
  return btoa(
    data
      .split('')
      .map((char, index) => char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
      .join(',')
  );
};

const Page: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const flashDescription = navigator.plugins?.["Shockwave Flash"]?.description;
    if (flashDescription !== "Shockwave Flash 34.0 r0") {
      navigate("/");
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/swfobject/swfobject@master/swfobject/swfobject.js";
    script.async = true;

    script.onload = () => {
      if (containerRef.current) {
        const flashDiv = document.createElement("div");
        flashDiv.id = "game";
        containerRef.current.appendChild(flashDiv);

        const swfUrl = "/api/file?path=Loader.swf";
        const flashVars = {};
        const params = {
          quality: "high",
          bgcolor: "#ffffff",
          allowfullscreen: "true",
          allowscriptaccess: "always",
          wmode: /Firefox/.test(navigator.userAgent) ? "opaque" : "direct",
        };
        const attributes = {
          id: flashDiv.id,
          name: flashDiv.id,
        };

        const xhr = new XMLHttpRequest();
        xhr.open('GET', swfUrl, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('x-version', encrypt(flashDescription || "", "$%@&*!").slice(6, 20));
        xhr.onload = function() {
          if (this.status === 200) {
            const blob = new Blob([this.response], { type: 'application/x-shockwave-flash' });
            const url = URL.createObjectURL(blob);

            window.swfobject.embedSWF(
              url,
              flashDiv.id,
              "960",
              "550",
              "9.0.0",
              null,
              flashVars,
              params,
              attributes
            );
          }
        };
        xhr.send();
      }
      script.remove();
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div ref={containerRef} />
    </div>
  );
};

export default Page;
