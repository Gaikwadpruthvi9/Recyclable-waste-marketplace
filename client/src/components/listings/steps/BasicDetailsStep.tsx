'use client';

import { WasteCategory, WasteType } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface BasicDetailsStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
}

export default function BasicDetailsStep({ formData, updateFormData, onNext }: BasicDetailsStepProps) {
    const handleNext = () => {
        if (!formData.title || !formData.category || !formData.type || !formData.quantity) {
            alert('Please fill in all required fields');
            return;
        }
        onNext();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Waste Details</h2>
            <p className="text-gray-600 mb-6">Tell us about the waste material you want to sell</p>

            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label className="label">Listing Title *</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="e.g., High-Quality Plastic Scrap - 500kg"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
                        maxLength={100}
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                {/* Category */}
                <div>
                    <label className="label">Waste Category *</label>
                    <select
                        className="input"
                        value={formData.category}
                        onChange={(e) => updateFormData({ category: e.target.value })}
                    >
                        <option value="">Select category</option>
                        {Object.values(WasteCategory).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <label className="label">Waste Type *</label>
                    <select
                        className="input"
                        value={formData.type}
                        onChange={(e) => updateFormData({ type: e.target.value })}
                    >
                        <option value="">Select type</option>
                        {Object.values(WasteType).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Quantity */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Quantity *</label>
                        <input
                            type="number"
                            className="input"
                            placeholder="e.g., 500"
                            value={formData.quantity}
                            onChange={(e) => updateFormData({ quantity: e.target.value })}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="label">Unit *</label>
                        <select
                            className="input"
                            value={formData.unit}
                            onChange={(e) => updateFormData({ unit: e.target.value })}
                        >
                            <option value="kg">Kilograms (kg)</option>
                            <option value="ton">Tons</option>
                            <option value="pieces">Pieces</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="label">Description *</label>
                    <textarea
                        className="textarea"
                        rows={5}
                        placeholder="Describe the waste material, its condition, source, and any other relevant details..."
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
                <button onClick={handleNext} className="btn btn-primary">
                    Continue to Photos
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
