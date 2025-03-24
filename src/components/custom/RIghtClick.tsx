import React, { useState, useRef, useEffect } from "react";

interface MenuItem {
  label: string;
  onClick?: () => void;
}

interface CustomContextMenuProps {
  menuItems: MenuItem[];
  children: React.ReactNode;
}

const RightClick = ({ children }: CustomContextMenuProps) => {
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle right-click event
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default browser menu

    setMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // Close menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className="relative">
      {children}

      {menu.visible && (
        <div
          ref={menuRef}
          className="absolute bg-white shadow-lg rounded-lg p-2 w-40"
          style={{ top: menu.y, left: menu.x }}
        >
          <ul className="space-y-1">Option 1</ul>
          <ul className="space-y-1">Option 2</ul>
          <ul className="space-y-1">Option 3</ul>
        </div>
      )}
    </div>
  );
};

export default RightClick;
