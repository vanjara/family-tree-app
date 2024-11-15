"use client"

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MemberForm = ({ person, onSave, onCancel }) => {
  const [formData, setFormData] = useState(person || {
    name: '',
    birthYear: '',
    deathYear: '',
    occupation: '',
    location: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthYear">Birth Year</Label>
          <Input
            id="birthYear"
            name="birthYear"
            value={formData.birthYear}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="deathYear">Death Year</Label>
          <Input
            id="deathYear"
            name="deathYear"
            value={formData.deathYear}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="http://..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const FamilyNode = ({ person, onAdd, onEdit, onDelete, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (updatedPerson) => {
    onEdit(person.id, updatedPerson);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 mb-4 ${level > 0 ? 'ml-12' : ''}`}>
        {person.children && person.children.length > 0 && (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 font-bold"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse family members" : "Expand family members"}
          >
            {isExpanded ? '−' : '+'}
          </Button>
        )}
        
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex gap-4">
            {person.imageUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={person.imageUrl} 
                  alt={`Photo of ${person.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/64/64";
                  }}
                />
              </div>
            )}
            <div className="flex flex-col flex-grow">
              <span className="font-medium">{person.name}</span>
              <span className="text-sm text-gray-500">
                {person.birthYear}{person.deathYear ? ` - ${person.deathYear}` : ''}
              </span>
              {person.occupation && (
                <span className="text-sm text-gray-600">{person.occupation}</span>
              )}
              {person.location && (
                <span className="text-sm text-gray-600">{person.location}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6" 
                    aria-label={`Add family member to ${person.name}`}
                  >
                    +
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Family Member to {person.name}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <MemberForm
                      onSave={(newPerson) => {
                        onAdd(person.id, newPerson);
                        setIsAdding(false);
                      }}
                      onCancel={() => setIsAdding(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6" 
                    aria-label={`Edit ${person.name}'s details`}
                  >
                    ✎
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit {person.name}'s Details</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <MemberForm
                      person={person}
                      onSave={handleEdit}
                      onCancel={() => setIsEditing(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to remove ${person.name}?`)) {
                    onDelete(person.id);
                  }
                }}
                aria-label={`Remove ${person.name}`}
              >
                ×
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {isExpanded && person.children && person.children.length > 0 && (
        <div className="relative">
          {person.children.map((child) => (
            <FamilyNode
              key={child.id}
              person={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FamilyTree = () => {
  const [familyData, setFamilyData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('familyTree');
    if (savedData) {
      setFamilyData(JSON.parse(savedData));
    } else {
      const initialData = {
        id: 1,
        name: "John Smith",
        birthYear: "1940",
        occupation: "Engineer",
        location: "New York",
        children: []
      };
      setFamilyData(initialData);
      localStorage.setItem('familyTree', JSON.stringify(initialData));
    }
  }, []);

  const findAndUpdateNode = (tree, id, updateFn) => {
    if (tree.id === id) {
      return updateFn(tree);
    }
    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map(child => findAndUpdateNode(child, id, updateFn))
      };
    }
    return tree;
  };

  const handleAddMember = (parentId, newPerson) => {
    const updatedData = findAndUpdateNode(familyData, parentId, (node) => ({
      ...node,
      children: [...(node.children || []), { ...newPerson, id: Date.now(), children: [] }]
    }));
    setFamilyData(updatedData);
    localStorage.setItem('familyTree', JSON.stringify(updatedData));
  };

  const handleEditMember = (personId, updatedPerson) => {
    const updatedData = findAndUpdateNode(familyData, personId, (node) => ({
      ...node,
      ...updatedPerson,
      id: node.id,
      children: node.children
    }));
    setFamilyData(updatedData);
    localStorage.setItem('familyTree', JSON.stringify(updatedData));
  };

  const handleDeleteMember = (personId) => {
    const deleteNode = (tree) => {
      if (!tree) return null;
      if (tree.id === personId) return null;
      if (tree.children) {
        const newChildren = tree.children
          .map(child => deleteNode(child))
          .filter(Boolean);
        return { ...tree, children: newChildren };
      }
      return tree;
    };

    const updatedData = deleteNode(familyData);
    if (updatedData) {
      setFamilyData(updatedData);
      localStorage.setItem('familyTree', JSON.stringify(updatedData));
    }
  };

  if (!familyData) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Family Tree</h1>
      <div className="bg-gray-50 p-6 rounded-lg">
        <FamilyNode 
          person={familyData}
          onAdd={handleAddMember}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      </div>
    </div>
  );
};

export default FamilyTree;
