'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface Student {
  id: string;
  name: string;
  roll: string;
  className: string;
  email: string;
  section: string;
  status: 'Active' | 'Inactive';
}

type SortKey = 'roll' | 'name';

export default function PremiumStudentsDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [className, setClassName] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortKey>('roll');

  // Hydration & Initial Load
  useEffect(() => {
    setIsMounted(true);
    const localData = localStorage.getItem('premium_students_db');
    if (localData) {
      try {
        setStudents(JSON.parse(localData));
      } catch (error) {
        console.error('Failed to parse local storage data:', error);
      }
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('premium_students_db', JSON.stringify(students));
    }
  }, [students, isMounted]);

  // Handle Create
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roll.trim() || !className.trim() || !email.trim() || !section.trim()) {
      return alert('Please fill out all fields before submitting.');
    }

    const newStudent: Student = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: name.trim(),
      roll: roll.trim(),
      className: className.trim(),
      email: email.trim().toLowerCase(),
      section: section.trim().toUpperCase(),
      status,
    };

    setStudents((prev) => [...prev, newStudent]);
    
    // Reset Form fields
    setName('');
    setRoll('');
    setClassName('');
    setEmail('');
    setSection('');
    setStatus('Active');
  };

  // Handle Delete
  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, status: student.status === 'Active' ? 'Inactive' : 'Active' }
          : student
      )
    );
  };

  // Performance Optimization: Memoized Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'Active').length;
    const uniqueClasses = new Set(students.map((s) => s.className)).size;
    return { total, active, uniqueClasses };
  }, [students]);

  // Performance Optimization: Memoized Filter & Sort Data
  const processedStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.roll.includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'roll') {
          // Naturally sort string numbers (e.g., "2" before "10")
          return a.roll.localeCompare(b.roll, undefined, { numeric: true, sensitivity: 'base' });
        }
        return a.name.localeCompare(b.name);
      });
  }, [students, searchTerm, statusFilter, sortBy]);

  // Slick Dark Loader State
  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex space-x-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s] shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s] shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
            <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Initializing Core...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Dashboard Grid */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="h-7 w-2 bg-indigo-500 rounded-full inline-block shadow-[0_0_15px_rgba(99,102,241,0.6)]"></span>
              Workspace Dashboard
            </h1>
            <p className="text-zinc-400 mt-1 text-sm font-medium">Manage corporate student registry records, performance indices, and credentials.</p>
          </div>
        </div>

        {/* Dynamic Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80 shadow-lg flex items-center justify-between group hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Matrix</p>
              <h3 className="text-3xl font-black text-white mt-1">{metrics.total}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80 shadow-lg flex items-center justify-between group hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Deployments</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{metrics.active}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-2xl border border-zinc-800/80 shadow-lg flex items-center justify-between group hover:border-zinc-700/80 transition-all duration-300">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Class Segments</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{metrics.uniqueClasses}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
          </div>
        </div>

        {/* Input Interactive Form Card */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-xl relative overflow-hidden p-6 sm:p-8">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"></div>
          
          <h2 className="text-md font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Register Student Node
          </h2>

          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Student Full Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full bg-zinc-950/70 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-600 text-sm" 
                placeholder="e.g. Asif Rahman" 
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Secure Email Address</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-zinc-950/70 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-600 text-sm" 
                placeholder="username@academy.org" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Roll Identity Code</label>
              <input 
                type="text" value={roll} onChange={(e) => setRoll(e.target.value)} 
                className="w-full bg-zinc-950/70 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-600 text-sm" 
                placeholder="e.g. 05" 
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Class Tier</label>
              <input 
                type="text" value={className} onChange={(e) => setClassName(e.target.value)} 
                className="w-full bg-zinc-950/70 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-600 text-sm" 
                placeholder="e.g. 10" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Section Branch</label>
              <input 
                type="text" value={section} onChange={(e) => setSection(e.target.value)} 
                className="w-full bg-zinc-950/70 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-600 text-sm" 
                placeholder="e.g. Alpha" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Deployment Status</label>
              <select 
                value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full bg-zinc-950/70 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm cursor-pointer"
              >
                <option value="Active" className="bg-zinc-950">Active</option>
                <option value="Inactive" className="bg-zinc-950">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.45)] cursor-pointer active:scale-[0.99]"
              >
 
           Add Student
              </button>
            </div>
          </form>
        </div>

        {/* Filters, Search & Sorting Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
          
          {/* Global Search Bar */}
          <div className="w-full md:w-72 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" placeholder="Filter index by name or roll..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 pl-9 pr-4 py-2 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500/80 transition-all"
            />
          </div>

          {/* Filtering & Sorting Controls Combo */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-start md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Sort Matrix:</span>
              <select 
                value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="roll">By Roll Sequence</option>
                <option value="name">By Alphabetical Name</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Status Scope:</span>
              <select 
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Entities</option>
                <option value="Active">Active Nodes</option>
                <option value="Inactive">Inactive Nodes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Architecture Matrix Table */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap border-collapse">
              <thead className="bg-zinc-950/80 border-b border-zinc-800/80">
                <tr>
                  <th className="py-4 px-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Roll</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Identity Details</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Class Scope</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Status Index</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-center">Operational Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {processedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center bg-zinc-900/20">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl mb-4 text-zinc-700">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        </div>
                        <p className="text-md font-bold text-zinc-300">No Registry Matrix Found</p>
                        <p className="text-xs text-zinc-500 mt-1 max-w-sm">No student structures matched your current configurations. Clear filters or inject a new student node above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  processedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-zinc-950/40 transition-colors group">
                      
                      {/* Formatted Roll */}
                      <td className="py-4 px-6 font-mono font-bold text-indigo-400 text-sm">
                        #{student.roll.padStart(2, '0')}
                      </td>
                      
                      {/* Name & Private Email */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white tracking-wide text-sm">{student.name}</span>
                          <span className="text-xs text-zinc-500 font-mono mt-0.5">{student.email}</span>
                        </div>
                      </td>
                      
                      {/* Tier Structure */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="bg-zinc-950 text-indigo-300 border border-zinc-800/80 py-1 px-2.5 rounded-lg text-[11px] font-black tracking-wide">
                            Tier {student.className}
                          </span>
                          <span className="bg-zinc-800/70 text-zinc-400 py-1 px-2 rounded-lg text-[11px] font-black tracking-widest">
                            {student.section}
                          </span>
                        </div>
                      </td>

                      {/* Interactive Runtime State */}
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => handleToggleStatus(student.id)}
                          title="Click to override operational deployment status"
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-200 cursor-pointer hover:scale-[1.03] flex items-center w-fit ${
                            student.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                              : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/80'
                          }`}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`}></span>
                          {student.status}
                        </button>
                      </td>

                      {/* Explicit Record Elimination Flag */}
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleDeleteStudent(student.id)} 
                          className="inline-flex items-center gap-1.5 text-rose-400 bg-rose-500/5 hover:bg-rose-500 hover:text-white border border-rose-500/10 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 opacity-60 group-hover:opacity-100 shadow-sm cursor-pointer active:scale-95"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Purge
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}

