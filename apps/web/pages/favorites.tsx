import { ArrowLeft, ChevronDown, FileText, Folder, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/router"
import { useState } from "react"
import { it } from "node:test"

// This is sample data - in a real app this would come from your backend
const itemsList = [
  {
    id: 1,
    name: "User Guides",
    type: "folder",
    location: "Enterprise",
    isFavorite: true
  },
  {
    id: 2,
    name: "ANR-PROD-ECM-UG-ECM.pdf",
    type: "pdf",
    location: "User Guides",
    isFavorite: true
  }
]

interface Item {
  id: number;
  name: string;
  type: string;
  location: string;
  isFavorite: boolean;
}

export default function Favorites() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [items, setItems] = useState<Item[]>(itemsList);

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : [])
  }

  const toggleItem = (itemId: number) => {
    setSelectedItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    )
  }

  //write code to toggle favorite as well as update the original itemList array
  const toggleFavorite = (itemId: number, index: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  
    // Update the original itemsList array
    const itemIndex = itemsList.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      itemsList[itemIndex].isFavorite = !itemsList[itemIndex].isFavorite;
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen "
    style={{
      backgroundColor: '#ffffff', // Light theme background color
      color: '#171717', // Light theme text color
    }}>
      <div className="border-b">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={()=>router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <h1 className="text-lg font-semibold">Favorites</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b px-4 py-2">
        <Button variant="outline" className="h-8 gap-2">
          <span className="text-xs font-normal">Add group</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Name"
            className="h-8 w-32"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <div className="w-full">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableCell className="w-12">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={toggleAll}
                  />
                </TableCell>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium" colSpan={4}>
                  Ungrouped
                </TableCell>
              </TableRow>
              {items.map((item,index) => (
                <TableRow
                    key={item.id}
                    className={`${
                    selectedItems.includes(item.id) ? "bg-gray-200" : ""
                    } hover:bg-gray-200`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.type === 'folder' ? (
                        <Folder className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-red-500" />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(item.id,index)}
                    >
                      <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}  />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>To personalize the Favorites list, you can push your favorite group to the top.</p>
          <p>You can also re-order items within the groups, so that your most favorite items appear at the top of the Favorites list.</p>
        </div>
      </div>
    </div>
  )
}