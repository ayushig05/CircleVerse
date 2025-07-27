import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const SearchDialog = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("posts");

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      return;
    }
    navigate(`/?search=${encodeURIComponent(searchTerm)}&type=${searchType}`);
    onClose();
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-full dark:bg-zinc-900 dark:text-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-lg sm:text-xl">
            Search
          </DialogTitle>
        </DialogHeader>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full p-2 border cursor-pointer dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded mb-4 text-sm sm:text-base"
        >
          <option value="posts">Posts</option>
          <option value="users">Users</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full p-2 border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded mb-4 text-sm sm:text-base placeholder:text-gray-500 dark:placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={`Search ${searchType}`}
        />
        <Button
          onClick={handleSearch}
          className="w-full cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Search
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
