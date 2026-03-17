import React, { useState } from 'react';
import { Image, Plus } from 'lucide-react';
import FormSection from '../components/FormSection';
import MediaUploader from '../../../components/media/MediaUploader';

interface MediaTabProps {
    image_urls: string[];
    updateField: (field: string, value: any) => void;
}

const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600';

const MediaTab: React.FC<MediaTabProps> = ({ image_urls, updateField }) => {
    const [imageUrlInput, setImageUrlInput] = useState('');

    const addImageUrl = () => {
        const url = imageUrlInput.trim();
        if (url && !image_urls.includes(url)) {
            updateField('image_urls', [...image_urls, url]);
            setImageUrlInput('');
        }
    };

    return (
        <div className="space-y-8">
            <FormSection title="Upload Images" description="Drag and drop or click to upload product images">
                <MediaUploader
                    imageUrls={image_urls}
                    onImagesChange={(urls) => updateField('image_urls', urls)}
                    maxFiles={10}
                />
            </FormSection>

            <FormSection title="Or Paste Image URL" description="Add images by URL if upload isn't available">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                        <input
                            type="url"
                            value={imageUrlInput}
                            onChange={e => setImageUrlInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }}
                            className={inputClass + ' pl-10'}
                            placeholder="Paste image URL..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addImageUrl}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-all flex items-center gap-1.5"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>
            </FormSection>
        </div>
    );
};

export default MediaTab;
