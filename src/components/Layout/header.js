"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

import { Edit, LogOut, Loader2, Search } from "lucide-react";
import { logoutUserAction } from "@/actions/logout";
import { searchPostsAction } from "@/actions/blogInteractions";

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term"),
});

export default function Header({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(searchSchema),
  });

  // --- Search Handler ---
  async function onSearchSubmit(data) {
    setIsLoading(true);
    try {
      const result = await searchPostsAction(data.query);
      if (result.success) {
        setSearchResults(result.posts);
        setIsSheetOpen(true);
        reset();
      } else {
        throw new Error(result.error || "No results found");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong during search");
    } finally {
      setIsLoading(false);
    }
  }

  // --- Logout Handler ---
  async function handleLogout() {
    try {
      const result = await logoutUserAction();
      if (result.success) router.push("/login");
      else throw new Error(result.error || "Logout failed");
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <h1
              onClick={() => router.push("/")}
              className="text-2xl cursor-pointer font-bold font-serif tracking-tighter"
            >
              <span className="bg-black text-white px-2 py-1 rounded-full">
                B
              </span>
              <span className="ml-1">Blog</span>
            </h1>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Form */}
              <form
                className="relative hidden md:block"
                onSubmit={handleSubmit(onSearchSubmit)}
              >
                <Input
                  {...register("query")}
                  type="text"
                  placeholder="Search blogs..."
                  className="pl-10 pr-4 py-1 w-64 rounded-full bg-gray-100 border-0 focus-visible:ring-1"
                />
                {isLoading ? (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 animate-spin" />
                ) : (
                  <Search
                    onClick={handleSubmit(onSearchSubmit)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 cursor-pointer"
                  />
                )}
              </form>

              {/* Create Blog Button */}
              <Button
                onClick={() => router.push("/blog/create")}
                variant="ghost"
                size="icon"
                aria-label="Create new blog"
                title="Create new blog"
              >
                <Edit className="h-6 w-6" />
              </Button>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="h-8 w-8 cursor-pointer"
                    aria-label={`User avatar for ${user?.userName || "User"}`}
                  >
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt={`Avatar of ${user?.userName || "User"}`}
                    />
                    <AvatarFallback>
                      {user?.userName
                        ? user.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    Signed in as {user?.userName || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Search Results</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {searchResults?.length > 0 ? (
              searchResults.map((item) => (
                <article
                  key={item._id}
                  onClick={() => {
                    setIsSheetOpen(false);
                    router.push(`/blog/${item._id}`);
                  }}
                  className="cursor-pointer flex gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Image Wrapper */}
                  <div className="w-1/3 h-28 relative flex-shrink-0">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover rounded-l-lg"
                    />
                  </div>

                  <div className="flex-1 p-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {item.title}
                    </h3>
                    {/* Hydration-safe date */}
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.createdAt).toDateString()}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <h3 className="text-center font-semibold text-gray-600">
                No blogs found
              </h3>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
