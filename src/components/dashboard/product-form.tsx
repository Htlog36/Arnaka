'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductInput } from '@/lib/validations/product'
import { Button, Input, Textarea } from '@/components/ui'
import { createProduct, updateProduct } from '@/lib/actions/product'
import { useState, useTransition } from 'react'
import { Loader2, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

// We need categories passed in
interface Category {
    id: string
    name: string
}

interface ProductFormProps {
    categories: Category[]
    initialData?: ProductInput & { id?: string } // existing product
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<ProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            status: 'DRAFT',
            categoryId: categories[0]?.id || '',
            images: [{ url: '', alt: '' }],
            variants: []
        }
    })

    const { register, control, handleSubmit, formState: { errors } } = form

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: 'images'
    })

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: 'variants'
    })

    const onSubmit = (data: ProductInput) => {
        startTransition(async () => {
            try {
                if (initialData?.id) {
                    await updateProduct(initialData.id, data)
                } else {
                    await createProduct(data)
                }
                // Redirect handled in server action
            } catch (error) {
                console.error(error)
                alert('Une erreur est survenue.')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* General Info */}
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-medium">Informations Générales</h3>

                    <div>
                        <label className="text-sm font-medium">Nom du produit</label>
                        <Input {...register('name')} placeholder="Ex: T-shirt Vintage" />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea {...register('description')} placeholder="Description détaillée..." rows={4} />
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Prix (€)</label>
                            <Input type="number" step="0.01" {...register('price')} />
                            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Stock</label>
                            <Input type="number" {...register('stock')} />
                            {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Catégorie</label>
                        <select
                            {...register('categoryId')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Statut</label>
                        <select
                            {...register('status')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="DRAFT">Brouillon</option>
                            <option value="ACTIVE">Actif</option>
                            <option value="ARCHIVED">Archivé</option>
                        </select>
                    </div>
                </div>

                {/* Images & Variants */}
                <div className="space-y-8">
                    {/* Images */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Images</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: '', alt: '' })}>
                                <Plus className="mr-2 h-4 w-4" /> Ajouter
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {imageFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input {...register(`images.${index}.url`)} placeholder="https://..." />
                                        {errors.images?.[index]?.url && <p className="text-xs text-red-500">{errors.images[index]?.url?.message}</p>}
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            {errors.images && <p className="text-xs text-red-500">{errors.images.message}</p>}
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Variantes (Optionnel)</h3>
                            <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({ name: '', stock: 0 })}>
                                <Plus className="mr-2 h-4 w-4" /> Ajouter
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {variantFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <div className="flex-1 space-y-2">
                                        <Input {...register(`variants.${index}.name`)} placeholder="Nom (ex: XL, Rouge)" />
                                        <div className="flex gap-2">
                                            <Input type="number" {...register(`variants.${index}.stock`)} placeholder="Stock" />
                                            <Input type="number" step="0.01" {...register(`variants.${index}.price`)} placeholder="Prix (+/-)" />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>
                    Annuler
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Mettre à jour' : 'Créer le produit'}
                </Button>
            </div>
        </form>
    )
}
