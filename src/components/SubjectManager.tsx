"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface SubjectManagerProps {
  subjects: { id: string; name: string }[];
  onAddSubject: (name: string) => Promise<void>;
  onDeleteSubject: (id: string) => Promise<void>;
}

export default function SubjectManager({ 
  subjects,
  onAddSubject,
  onDeleteSubject 
}: SubjectManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const handleAddSubject = async (data: any) => {
    setIsAdding(true);
    try {
      await onAddSubject(data.name);
      reset();
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleDeleteSubject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject? All pages in this subject will also be deleted.")) {
      setIsDeleting(true);
      try {
        await onDeleteSubject(id);
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete subject. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Manage Subjects</h2>
      
      <div className="mb-4">
        <form onSubmit={handleSubmit(handleAddSubject)} className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="New subject name"
            {...register("name", { required: "Subject name is required" })}
          />
          <button 
            type="submit" 
            className="btn-primary whitespace-nowrap"
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add Subject"}
          </button>
        </form>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
        )}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Current Subjects:</h3>
        {subjects.length === 0 ? (
          <p className="text-gray-500 italic">No subjects yet. Add one above to get started.</p>
        ) : (
          <ul className="space-y-2">
            {subjects.map(subject => (
              <li key={subject.id} className="flex justify-between items-center py-2 px-3 rounded-md bg-white dark:bg-gray-800 border border-[color:var(--border)]">
                <span>{subject.name}</span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteSubject(subject.id)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
