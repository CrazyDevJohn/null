import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";

const Dock = () => {
  const docRef = useRef(null);

  useGSAP(() => {
    const dock = docRef.current;

    if (!dock) return;

    const icon = dock.querySelectorAll(".dock-icon");

    const animateIcon = (mouseX) => {
      const left = dock.getBoundingClientRect().left;

      icon.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);

        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animateIcon(e.clientX - left);
    };

    const resetIcon = () => {
      icon.forEach((icon) =>
        gsap.to(icon, { scale: 1, y: 0, duration: 0.5, ease: "power3.out" })
      );
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcon);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcon);
    };
  });

  const toggleApp = (app) => {
    // Function to toggle the application window
    console.log(`Toggling app with id: ${id}`);
  };

  return (
    <section id="dock">
      <div ref={docRef} className="dock-container">
        {dockApps.map(({ id, name, canOpen, icon }) => (
          <div key={id} className="flex relative justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={`${name} icon`}
                className={canOpen ? "" : "opacity-60"}
              />
            </button>
          </div>
        ))}

        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};

export default Dock;
