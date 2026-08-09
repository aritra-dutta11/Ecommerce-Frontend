import { useState } from "react";
import { X, Upload } from "lucide-react";

interface AddCategoryModalProps {
  onClose: () => void;
  onSubmit: (data: {
    categoryName: string;
    categoryDesc: string;
    image: File | null;
  }) => Promise<void>;
}

export default function AddCategoryModal({
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        categoryName,
        categoryDesc,
        image,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            Add Category
          </h2>

          <p className="mt-1 text-sm text-ink-500">
            Create a new product category.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Category Image
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-300 px-6 py-8 transition-colors hover:border-brand-500 hover:bg-brand-50">
              <Upload className="mb-2 text-ink-400" size={28} />

              {image ? (
                <span className="text-sm font-medium text-ink-700">
                  {image.name}
                </span>
              ) : (
                <>
                  <span className="text-sm font-medium text-ink-700">
                    Click to upload
                  </span>
                  <span className="mt-1 text-xs text-ink-500">
                    PNG, JPG or WEBP
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImage(file);
                }}
              />
            </label>
          </div>

          {/* Category Name */}
          <div>
            <label
              htmlFor="categoryName"
              className="mb-1.5 block text-sm font-medium text-ink-700"
            >
              Category Name
            </label>

            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              className="w-full rounded-xl border border-ink-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Category Description */}
          <div>
            <label
              htmlFor="categoryDescription"
              className="mb-1.5 block text-sm font-medium text-ink-700"
            >
              Category Description
            </label>

            <textarea
              id="categoryDescription"
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              placeholder="Enter category description"
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-ink-300 px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              {submitting ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>Add Category</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
