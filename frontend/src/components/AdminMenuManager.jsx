import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { DIETARY_TAGS } from './DietaryFilterBar';

const CATEGORIES = [
  'ESPRESSO_COFFEE',
  'COLD_BREWS_NITRO',
  'ARTISANAL_TEAS',
  'BAKERY_PASTRIES',
  'SAVORY_BRUNCH',
];

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '5.50',
  category: 'ESPRESSO_COFFEE',
  flavorNotesInput: 'Nutty & Chocolatey, Smooth Body',
  dietaryTags: ['Gluten-Free', 'Nut-Free'],
  calories: '120',
  imageUrl:
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
  isAvailable: true,
};

const AdminMenuManager = ({
  menuItems = [],
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(INITIAL_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      flavorNotesInput: (item.flavorNotes || item.flavor_notes || []).join(', '),
      dietaryTags: item.dietaryTags || item.dietary_tags || [],
      calories: item.calories ? String(item.calories) : '',
      imageUrl: item.imageUrl || item.image_url,
      isAvailable: item.isAvailable ?? item.is_available ?? true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const toggleDietary = (tag) => {
    setFormData((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        flavorNotes: formData.flavorNotesInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        dietaryTags: formData.dietaryTags,
        calories: formData.calories ? Number(formData.calories) : undefined,
        imageUrl: formData.imageUrl.trim(),
        isAvailable: Boolean(formData.isAvailable),
      };

      if (editingItem) {
        await onUpdateItem(editingItem.id, payload);
      } else {
        await onCreateItem(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(
        err.response?.data?.error ||
          'Failed to save menu item. Check all required fields.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    const currentStatus = item.isAvailable ?? item.is_available ?? true;
    await onUpdateItem(item.id, { isAvailable: !currentStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-950">
            Roastery & Bakery Catalog ({menuItems.length} items)
          </h3>
          <p className="text-xs text-espresso-600">
            Add seasonal micro-lots, update pricing, or toggle live kitchen
            availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso-900 text-crema text-xs font-bold hover:bg-espresso-800 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#d49b54]" />
          Add New Menu Item
        </button>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-3xl border border-espresso-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-espresso-200 bg-espresso-50/70 text-[11px] font-bold uppercase tracking-wider text-espresso-600">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Dietary Tags</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso-100 text-xs">
              {menuItems.map((item) => {
                const available = item.isAvailable ?? item.is_available ?? true;
                const tags = item.dietaryTags || item.dietary_tags || [];
                return (
                  <tr key={item.id} className="hover:bg-espresso-50/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || item.image_url}
                          alt={item.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-serif font-bold text-sm text-espresso-950">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-espresso-500 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-espresso-800">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-espresso-950">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          available
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {available ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-700" />
                            In Stock
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-red-700" />
                            Sold Out
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg text-espresso-700 hover:bg-espresso-100"
                        title="Edit Menu Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete Menu Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/60 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-espresso-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-espresso-950">
                {editingItem ? `Edit ${editingItem.name}` : 'Create New Menu Item'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-espresso-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-espresso-800 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-espresso-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-espresso-200 px-3 py-2 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">
                  Culinary Description (min 10 chars) *
                </label>
                <textarea
                  rows={2}
                  required
                  minLength={10}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-espresso-200 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-espresso-800 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.50"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full rounded-xl border border-espresso-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-espresso-800 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.calories}
                    onChange={(e) =>
                      setFormData({ ...formData, calories: e.target.value })
                    }
                    className="w-full rounded-xl border border-espresso-200 px-3 py-2"
                  />
                </div>

                <div className="flex items-end pb-1">
                  <label className="inline-flex items-center gap-2 font-bold text-espresso-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="rounded text-espresso-900"
                    />
                    Available Now
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full rounded-xl border border-espresso-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1">
                  Flavor Notes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.flavorNotesInput}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      flavorNotesInput: e.target.value,
                    })
                  }
                  placeholder="Bergamot, Dark Cocoa, Velvety"
                  className="w-full rounded-xl border border-espresso-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-espresso-800 mb-1.5">
                  Dietary Compatibility Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_TAGS.map((tag) => {
                    const selected = formData.dietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietary(tag)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold border ${
                          selected
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-white text-espresso-700 border-espresso-200'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200">
                  {formError}
                </div>
              )}

              <div className="pt-3 border-t border-espresso-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-espresso-200 font-bold text-espresso-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-espresso-900 text-crema font-bold hover:bg-espresso-800"
                >
                  {submitting
                    ? 'Saving...'
                    : editingItem
                    ? 'Save Changes'
                    : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManager;

