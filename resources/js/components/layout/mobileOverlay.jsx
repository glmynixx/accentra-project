export default function MobileOverlay({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-40
        bg-gray-900/30
        backdrop-blur-[2px]
        transition-opacity
        duration-300
        min-[769px]:hidden
      "
      onClick={onClose}
      aria-hidden="true"
    />
  );
}