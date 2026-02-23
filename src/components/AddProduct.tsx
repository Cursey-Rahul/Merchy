"use client"
import { useState } from 'react'
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import Image from 'next/image';
type Option = {
  title: string;
  additionalPrice: number;
};


const AddProduct = () => {
    const [options, setOptions] =  useState<Option[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(false);
    
const handleOptionChange = (index: number, field: 'title' | 'additionalPrice', value: string | number) => {
  const newOptions = [...options];

  if (field === 'additionalPrice') {
    newOptions[index][field] = Number(value) as Option['additionalPrice'];
  } else {
    newOptions[index][field] = value as Option['title'];
  }

  setOptions(newOptions);
};

const addOption = () => {
  setOptions([...options, { title: '', additionalPrice: 0 }]);
};

const removeOption = (index: number) => {
  const newOptions = options.filter((_, i) => i !== index);
  setOptions(newOptions);
};

  const handleImageUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'unsigned_preset'); 
    formData.append('folder', 'products'); 

    const res = await fetch(`https://api.cloudinary.com/v1_1/dq5vadic7/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.secure_url); // ✅ set the uploaded image URL
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert('Please upload image first');

    const res = await fetch('/api/add-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        price,
        catSlug,
        description,
        options, 
        img: imageUrl,
        featured,   
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Product added!');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 grid gap-4">
      <Input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2" />
      <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="border p-2" />
       <Select value={catSlug} onValueChange={setCatSlug} >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
         <SelectLabel>Creator</SelectLabel>
<SelectItem value="bhuvan-bam">Bhuvan Bam</SelectItem>
<SelectItem value="mumbiker-nikhil">Mumbiker Nikhil</SelectItem>
<SelectItem value="carryminati">CarryMinati</SelectItem>
<SelectItem value="sejal-kumar">Sejal Kumar</SelectItem>
<SelectItem value="mostlysane">MostlySane</SelectItem>
<SelectItem value="sid">Sid</SelectItem>
<SelectItem value="arashi">Arashi</SelectItem>

        </SelectGroup>
      </SelectContent>
    </Select>
      <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2" />

    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode"  checked={featured} onCheckedChange={setFeatured}/>
      <Label htmlFor="airplane-mode">Feature Product</Label>
    </div>
    <div className="grid gap-2">
  <h2 className="text-lg font-semibold">Product Options</h2>
  {options.map((option, index) => (
    <div key={index} className="flex items-center gap-2">
      <Input
        type="text"
        value={option.title}
        onChange={(e) =>
          handleOptionChange(index, 'title', e.target.value)
        }
        placeholder="Option Title"
        className="border p-2"
      />
      <Input
        type="number"
        value={option.additionalPrice}
        onChange={(e) =>
          handleOptionChange(index, 'additionalPrice', e.target.value)
        }
        placeholder="Additional Price"
        className="border p-2"
      />
      <Button
        type="button"
        variant="destructive"
        onClick={() => removeOption(index)}
      >
        X
      </Button>
    </div>
  ))}
  <Button type="button" onClick={addOption}>
    + Add Option
  </Button>
</div>
  
      <Input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="border p-2" />
      <Button type="button" onClick={handleImageUpload} className="bg-green-600 text-white p-2 rounded">
        {loading ? "Uploading..." : "Upload Image"}
      </Button>

      {imageUrl && (
        <Image src={imageUrl} width={200} height={200} alt="Uploaded" className="w-32 h-32 object-cover" />
      )}

      <Button type="submit" className="bg-blue-600 text-white p-2 rounded">Add Product</Button>
    </form>
  )
}

export default AddProduct