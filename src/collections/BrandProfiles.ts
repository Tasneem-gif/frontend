import type { Access, CollectionConfig } from 'payload'

const ownedByUser: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}

export const BrandProfiles: CollectionConfig = {
  slug: 'brand-profiles',
  admin: {
    group: 'Contevo',
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    read: ownedByUser,
    update: ownedByUser,
    delete: ownedByUser,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          return { ...data, owner: req.user.id }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    { name: 'name', type: 'text', required: true },
    {
      name: 'businessType',
      type: 'select',
      required: true,
      options: ['فروشگاه آنلاین', 'خدمات حرفه‌ای', 'آموزشی', 'شخصی', 'سایر'],
    },
    { name: 'audience', type: 'textarea', required: true },
    {
      name: 'tone',
      type: 'select',
      required: true,
      options: ['حرفه‌ای', 'صمیمی', 'الهام‌بخش', 'آموزشی', 'طنز'],
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'sampleTexts',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}
