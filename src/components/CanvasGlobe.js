import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const CanvasGlobe = forwardRef(({
  locations = [],
  selectedLocation = null,
  onLocationClick = () => {},
  size = 680
}, ref) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Expose pointOfView method to parent
  useImperativeHandle(ref, () => ({
    pointOfView: (coords, duration = 1000) => {
      if (coords.lat !== undefined && coords.lng !== undefined) {
        // Convert lat/lng to rotation
        targetRotation.current = {
          x: -coords.lat * Math.PI / 180,
          y: -coords.lng * Math.PI / 180
        };
      }
    }
  }));

  // 3D to 2D projection
  const project3D = (x, y, z, rotX, rotY) => {
    // Rotate around Y axis
    let cosY = Math.cos(rotY);
    let sinY = Math.sin(rotY);
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;

    // Rotate around X axis
    let cosX = Math.cos(rotX);
    let sinX = Math.sin(rotX);
    let y1 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    // Perspective projection
    let scale = 300 / (300 + z2);
    return {
      x: x1 * scale + size / 2,
      y: y1 * scale + size / 2,
      z: z2,
      scale: scale
    };
  };

  // Convert lat/lng to 3D coordinates
  const latLngTo3D = (lat, lng, radius = 100) => {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;

    return {
      x: -radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  };

  // World map dots data - simplified continents
  const generateWorldMapDots = () => {
    const dots = [];

    // Asia
    for (let lat = 10; lat <= 70; lat += 3) {
      for (let lng = 40; lng <= 140; lng += 3) {
        dots.push({ lat, lng });
      }
    }

    // Europe
    for (let lat = 35; lat <= 70; lat += 3) {
      for (let lng = -10; lng <= 40; lng += 3) {
        dots.push({ lat, lng });
      }
    }

    // Africa
    for (let lat = -35; lat <= 35; lat += 3) {
      for (let lng = -20; lng <= 50; lng += 3) {
        dots.push({ lat, lng });
      }
    }

    // North America
    for (let lat = 15; lat <= 70; lat += 3) {
      for (let lng = -165; lng <= -50; lng += 3) {
        dots.push({ lat, lng });
      }
    }

    // South America
    for (let lat = -55; lat <= 10; lat += 3) {
      for (let lng = -80; lng <= -35; lng += 3) {
        dots.push({ lat, lng });
      }
    }

    // Australia
    for (let lat = -40; lat <= -10; lat += 3) {
      for (let lng = 110; lng <= 155; lng += 3) {
        dots.push({ lat, lng });
      }
    }

    return dots;
  };

  // Draw the globe
  const drawGlobe = (ctx, rotX, rotY) => {
    ctx.clearRect(0, 0, size, size);

    const radius = 150;
    const segments = 24;
    const rings = 16;

    // Draw latitude lines
    for (let i = 0; i <= rings; i++) {
      const lat = (i / rings) * Math.PI;
      const y = radius * Math.cos(lat);
      const currentRadius = radius * Math.sin(lat);

      const points = [];
      for (let j = 0; j <= segments; j++) {
        const lng = (j / segments) * Math.PI * 2;
        const x = currentRadius * Math.cos(lng);
        const z = currentRadius * Math.sin(lng);

        const projected = project3D(x, y, z, rotX, rotY);
        points.push(projected);
      }

      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
      ctx.lineWidth = 0.5;

      let started = false;
      for (let j = 0; j < points.length - 1; j++) {
        if (points[j].z > -50 && points[j + 1].z > -50) {
          if (!started) {
            ctx.moveTo(points[j].x, points[j].y);
            started = true;
          }
          ctx.lineTo(points[j + 1].x, points[j + 1].y);
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw longitude lines
    for (let i = 0; i < segments; i++) {
      const lng = (i / segments) * Math.PI * 2;

      const points = [];
      for (let j = 0; j <= rings; j++) {
        const lat = (j / rings) * Math.PI;
        const y = radius * Math.cos(lat);
        const currentRadius = radius * Math.sin(lat);
        const x = currentRadius * Math.cos(lng);
        const z = currentRadius * Math.sin(lng);

        const projected = project3D(x, y, z, rotX, rotY);
        points.push(projected);
      }

      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
      ctx.lineWidth = 0.5;

      let started = false;
      for (let j = 0; j < points.length - 1; j++) {
        if (points[j].z > -50 && points[j + 1].z > -50) {
          if (!started) {
            ctx.moveTo(points[j].x, points[j].y);
            started = true;
          }
          ctx.lineTo(points[j + 1].x, points[j + 1].y);
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw world map dots
    const worldDots = generateWorldMapDots();
    worldDots.forEach(dot => {
      const pos3D = latLngTo3D(dot.lat, dot.lng, radius);
      const projected = project3D(pos3D.x, pos3D.y, pos3D.z, rotX, rotY);

      // Only draw dots on the visible side of the globe
      if (projected.z > -50) {
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
        ctx.fill();
      }
    });

    // Draw location markers
    const markerData = locations.map(loc => {
      const pos3D = latLngTo3D(loc.lat, loc.lng, radius);
      const projected = project3D(pos3D.x, pos3D.y, pos3D.z, rotX, rotY);
      return { ...loc, ...projected };
    });

    // Sort by z-index (draw far ones first)
    markerData.sort((a, b) => a.z - b.z);

    // Draw markers
    markerData.forEach(marker => {
      if (marker.z > -50) {
        const isSelected = marker.name === selectedLocation;
        const markerRadius = isSelected ? 8 : 5;

        // Draw marker shadow/glow
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, markerRadius + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
        ctx.fill();

        // Draw marker
        ctx.beginPath();
        ctx.arc(marker.x, marker.y, markerRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();

        // Draw pulsing ring for selected location
        if (isSelected) {
          const time = Date.now() / 1000;
          const pulse = (Math.sin(time * 2) + 1) / 2;
          const ringRadius = markerRadius + 5 + pulse * 5;

          ctx.beginPath();
          ctx.arc(marker.x, marker.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.5 * (1 - pulse)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const animate = () => {
      // Smooth rotation towards target
      const smoothing = 0.1;
      setRotation(prev => ({
        x: prev.x + (targetRotation.current.x - prev.x) * smoothing,
        y: prev.y + (targetRotation.current.y - prev.y) * smoothing
      }));

      drawGlobe(ctx, rotation.x, rotation.y);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, selectedLocation, locations, size]);

  // Auto-rotate when not dragging
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        targetRotation.current.y += 0.003;
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isDragging]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setLastMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = mouseX - lastMouse.x;
    const deltaY = mouseY - lastMouse.y;

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x += deltaY * 0.01;

    setLastMouse({ x: mouseX, y: mouseY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if click is on a marker
    const radius = 150;
    locations.forEach(loc => {
      const pos3D = latLngTo3D(loc.lat, loc.lng, radius);
      const projected = project3D(pos3D.x, pos3D.y, pos3D.z, rotation.x, rotation.y);

      const distance = Math.sqrt(
        Math.pow(mouseX - projected.x, 2) +
        Math.pow(mouseY - projected.y, 2)
      );

      const markerRadius = loc.name === selectedLocation ? 8 : 5;
      if (distance < markerRadius + 5 && projected.z > -50) {
        onLocationClick(loc);
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="cursor-grab active:cursor-grabbing"
      style={{
        width: size,
        height: size,
        background: '#2a2a2a',
        borderRadius: '50%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    />
  );
});

CanvasGlobe.displayName = 'CanvasGlobe';

export default CanvasGlobe;
