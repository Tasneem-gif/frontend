import type { Access, CollectionConfig } from 'payload'

const ownedByUser: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}

export const Contents: CollectionConfig = {
  slug: 'contents',
  admin: {
    group: 'Contevo',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'scheduledAt'],
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
    { name: 'title', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'کپشن', value: 'caption' },
        { label: 'پست متنی', value: 'text-post' },
        { label: 'استوری', value: 'story' },
        { label: 'سناریوی ریلز', value: 'reel-script' },
      ],
    },
    { name: 'topic', type: 'text', required: true },
    { name: 'goal', type: 'text' },
    { name: 'tone', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'پیش‌نویس', value: 'draft' },
        { label: 'در انتظار تأیید', value: 'pending' },
        { label: 'نیازمند اصلاح', value: 'revision' },
        { label: 'تأییدشده', value: 'approved' },
      ],
    },
    { name: 'scheduledAt', type: 'date' },
    { name: 'shareToken', type: 'text', unique: true, index: true },
    { name: 'clientComment', type: 'textarea' },
  ],
}
