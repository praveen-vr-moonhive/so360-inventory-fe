import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { TreeNode } from '../../utils/categoryTree';

interface CategoryTreeViewProps {
    tree: TreeNode[];
    onAdd: (name: string, description: string, parentId?: string) => Promise<void>;
    onUpdate: (id: string, data: { name?: string; description?: string }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    canManage: boolean;
}

interface TreeItemProps {
    node: TreeNode;
    onAdd: (name: string, description: string, parentId?: string) => Promise<void>;
    onUpdate: (id: string, data: { name?: string; description?: string }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    canManage: boolean;
}

const TreeItem: React.FC<TreeItemProps> = ({ node, onAdd, onUpdate, onDelete, canManage }) => {
    const [expanded, setExpanded] = useState(true);
    const [showAddChild, setShowAddChild] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(node.name);
    const [childName, setChildName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const hasChildren = node.children.length > 0;

    const handleAddChild = async () => {
        if (!childName.trim()) return;
        setIsAdding(true);
        try {
            await onAdd(childName.trim(), '', node.id);
            setChildName('');
            setShowAddChild(false);
            setExpanded(true);
        } finally {
            setIsAdding(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editName.trim() || editName === node.name) {
            setIsEditing(false);
            setEditName(node.name);
            return;
        }
        setIsSaving(true);
        try {
            await onUpdate(node.id, { name: editName.trim() });
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${node.name}"?`)) return;
        await onDelete(node.id);
    };

    return (
        <div>
            <div className="flex items-center gap-1 group py-1.5 px-2 rounded-lg hover:bg-slate-800/50 transition-colors" style={{ paddingLeft: `${node.depth * 20 + 8}px` }}>
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className={`w-5 h-5 flex items-center justify-center text-slate-500 ${hasChildren ? 'hover:text-slate-300' : 'invisible'}`}
                >
                    {hasChildren && (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                </button>

                {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="bg-slate-800 border border-slate-600 px-2 py-0.5 rounded text-sm text-white flex-1"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') { setIsEditing(false); setEditName(node.name); } }}
                        />
                        <button onClick={handleSaveEdit} disabled={isSaving} className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
                        <button onClick={() => { setIsEditing(false); setEditName(node.name); }} className="text-slate-400 hover:text-white"><X size={14} /></button>
                    </div>
                ) : (
                    <>
                        <span className="text-sm text-slate-300 flex-1">{node.name}</span>
                        {canManage && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setShowAddChild(true)} className="p-1 text-slate-500 hover:text-blue-400" title="Add subcategory"><Plus size={13} /></button>
                                <button onClick={() => setIsEditing(true)} className="p-1 text-slate-500 hover:text-amber-400" title="Edit"><Pencil size={13} /></button>
                                <button onClick={handleDelete} className="p-1 text-slate-500 hover:text-rose-400" title="Delete"><Trash2 size={13} /></button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showAddChild && (
                <div className="flex items-center gap-2 py-1.5" style={{ paddingLeft: `${(node.depth + 1) * 20 + 32}px` }}>
                    <input
                        type="text"
                        value={childName}
                        onChange={e => setChildName(e.target.value)}
                        placeholder="Subcategory name..."
                        className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-sm text-white flex-1"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleAddChild(); if (e.key === 'Escape') setShowAddChild(false); }}
                    />
                    <button onClick={handleAddChild} disabled={isAdding} className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs disabled:opacity-50">
                        {isAdding ? '...' : 'Add'}
                    </button>
                    <button onClick={() => setShowAddChild(false)} className="text-slate-400 hover:text-white"><X size={14} /></button>
                </div>
            )}

            {expanded && hasChildren && (
                <div>
                    {node.children.map(child => (
                        <TreeItem key={child.id} node={child} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} canManage={canManage} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CategoryTreeView: React.FC<CategoryTreeViewProps> = ({ tree, onAdd, onUpdate, onDelete, canManage }) => {
    const [showAddRoot, setShowAddRoot] = useState(false);
    const [rootName, setRootName] = useState('');
    const [isAddingRoot, setIsAddingRoot] = useState(false);

    const handleAddRoot = async () => {
        if (!rootName.trim()) return;
        setIsAddingRoot(true);
        try {
            await onAdd(rootName.trim(), '');
            setRootName('');
            setShowAddRoot(false);
        } finally {
            setIsAddingRoot(false);
        }
    };

    return (
        <div>
            {tree.length === 0 ? (
                <p className="text-sm text-slate-500 italic py-4">No categories created yet</p>
            ) : (
                <div className="space-y-0.5">
                    {tree.map(node => (
                        <TreeItem key={node.id} node={node} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} canManage={canManage} />
                    ))}
                </div>
            )}

            {canManage && (
                <div className="mt-3">
                    {showAddRoot ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={rootName}
                                onChange={e => setRootName(e.target.value)}
                                placeholder="Category name..."
                                className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-sm text-white flex-1"
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Enter') handleAddRoot(); if (e.key === 'Escape') setShowAddRoot(false); }}
                            />
                            <button onClick={handleAddRoot} disabled={isAddingRoot} className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm disabled:opacity-50">
                                {isAddingRoot ? '...' : 'Add'}
                            </button>
                            <button onClick={() => setShowAddRoot(false)} className="text-slate-400 hover:text-white"><X size={14} /></button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddRoot(true)}
                            className="border border-dashed border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-400 hover:border-slate-500 transition-all flex items-center gap-1"
                        >
                            <Plus size={14} /> Add Category
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryTreeView;
