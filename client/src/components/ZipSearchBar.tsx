import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface ZipSearchBarProps {
  onSearch: (zip: string) => void;
  initialZip?: string;
  loading?: boolean;
}

export function ZipSearchBar({ onSearch, initialZip = "", loading }: ZipSearchBarProps) {
  const [zip, setZip] = useState(initialZip);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.trim()) {
      onSearch(zip.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter ZIP code (e.g., 30331)"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="pl-9"
            pattern="[0-9]{5}"
            maxLength={5}
            data-testid="input-zip"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !zip.trim()}
          data-testid="button-search-zip"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 ml-1">
        Enter a 5-digit ZIP code to view energy zone analysis
      </p>
    </form>
  );
}
