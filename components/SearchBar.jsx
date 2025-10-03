"use client"

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSuggestions(data.products);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (id) => {
    router.push(`/products/${id}`);
    onClose();
  };

  return (
    <div
      ref={ref}
      className="top-14 left-0 w-full z-50 bg-transparent fixed px-8 py-4"
    >
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-[#1a1a1a] border border-gray-700 text-white h-10"
      />

      {loading && <p className="text-sm mt-2 text-gray-400">Searching...</p>}

      {!loading && suggestions.length > 0 && (
        <ul className="mt-3 space-y-2">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded hover:bg-[#222] cursor-pointer"
              onClick={() => handleSelect(item.id)}
            >
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">₹{item.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && query.length >= 2 && suggestions.length === 0 && (
        <p className="text-sm mt-2 text-gray-400">No results found.</p>
      )}
    </div>
  );
}
