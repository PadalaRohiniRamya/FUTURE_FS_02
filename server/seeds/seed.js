const User = require('../models/User');
const Lead = require('../models/Lead');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create default admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@minicrm.com',
      password: 'admin123'
    });
    await admin.save();
    console.log('👤 Admin user created: admin@minicrm.com / admin123');

    // Sample leads
    const leads = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 555-0101',
        source: 'website',
        status: 'new',
        notes: [{ text: 'Filled contact form asking about enterprise plan', createdAt: new Date('2026-04-15') }]
      },
      {
        name: 'Michael Chen',
        email: 'mchen@startup.io',
        phone: '+1 555-0102',
        source: 'referral',
        status: 'contacted',
        notes: [
          { text: 'Referred by David Kim', createdAt: new Date('2026-04-10') },
          { text: 'Had initial call - interested in premium tier', createdAt: new Date('2026-04-12') }
        ]
      },
      {
        name: 'Emma Williams',
        email: 'emma.w@designstudio.com',
        phone: '+1 555-0103',
        source: 'social',
        status: 'converted',
        notes: [
          { text: 'Found us on LinkedIn', createdAt: new Date('2026-04-01') },
          { text: 'Demo completed - very impressed', createdAt: new Date('2026-04-05') },
          { text: 'Signed annual contract!', createdAt: new Date('2026-04-08') }
        ]
      },
      {
        name: 'James Rodriguez',
        email: 'j.rodriguez@agency.co',
        phone: '+1 555-0104',
        source: 'website',
        status: 'new',
        notes: [{ text: 'Interested in bulk pricing', createdAt: new Date('2026-04-16') }]
      },
      {
        name: 'Aisha Patel',
        email: 'aisha@freelance.dev',
        phone: '+91 98765-43210',
        source: 'referral',
        status: 'contacted',
        notes: [
          { text: 'Referral from previous client', createdAt: new Date('2026-04-09') },
          { text: 'Sent proposal - awaiting response', createdAt: new Date('2026-04-13') }
        ]
      },
      {
        name: 'David Kim',
        email: 'dkim@innovate.tech',
        phone: '+1 555-0106',
        source: 'website',
        status: 'converted',
        notes: [
          { text: 'Submitted form for custom solution', createdAt: new Date('2026-03-20') },
          { text: 'Multiple calls completed', createdAt: new Date('2026-03-25') },
          { text: 'Contract signed - 6 month deal', createdAt: new Date('2026-04-01') }
        ]
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.t@marketing.pro',
        phone: '+1 555-0107',
        source: 'social',
        status: 'new',
        notes: [{ text: 'Instagram DM inquiry', createdAt: new Date('2026-04-17') }]
      },
      {
        name: 'Robert Brown',
        email: 'rbrown@enterprise.com',
        phone: '+1 555-0108',
        source: 'other',
        status: 'contacted',
        notes: [
          { text: 'Met at tech conference', createdAt: new Date('2026-04-07') },
          { text: 'Follow-up email sent', createdAt: new Date('2026-04-10') }
        ]
      },
      {
        name: 'Priya Sharma',
        email: 'priya@webworks.in',
        phone: '+91 99887-76655',
        source: 'referral',
        status: 'converted',
        notes: [
          { text: 'Referred by Aisha Patel', createdAt: new Date('2026-03-15') },
          { text: 'Quick decision maker - signed in a week', createdAt: new Date('2026-03-22') }
        ]
      },
      {
        name: 'Tom Anderson',
        email: 'tanderson@solutions.biz',
        phone: '+1 555-0110',
        source: 'website',
        status: 'new',
        notes: []
      },
      {
        name: 'Nina Kowalski',
        email: 'nina.k@creative.co',
        phone: '+48 501-234-567',
        source: 'social',
        status: 'contacted',
        notes: [{ text: 'Twitter DM - interested in design tools integration', createdAt: new Date('2026-04-14') }]
      },
      {
        name: 'Carlos Mendez',
        email: 'carlos@latamtech.mx',
        phone: '+52 55-1234-5678',
        source: 'other',
        status: 'new',
        notes: [{ text: 'Cold outreach - responded positively', createdAt: new Date('2026-04-16') }]
      },
      {
        name: 'Jessica Lee',
        email: 'jlee@finserv.com',
        phone: '+1 555-0113',
        source: 'website',
        status: 'converted',
        notes: [
          { text: 'High-value enterprise lead', createdAt: new Date('2026-03-01') },
          { text: 'Multiple stakeholder meetings', createdAt: new Date('2026-03-10') },
          { text: 'Signed enterprise plan', createdAt: new Date('2026-03-20') }
        ]
      },
      {
        name: 'Alex Turner',
        email: 'alex@startup.lab',
        phone: '+44 7700-900123',
        source: 'referral',
        status: 'new',
        notes: [{ text: 'Referred by Jessica Lee - UK based startup', createdAt: new Date('2026-04-15') }]
      },
      {
        name: 'Maria Garcia',
        email: 'maria.g@ecommerce.shop',
        phone: '+34 612-345-678',
        source: 'social',
        status: 'contacted',
        notes: [
          { text: 'Found us through Facebook ad', createdAt: new Date('2026-04-11') },
          { text: 'Scheduled demo for next week', createdAt: new Date('2026-04-14') }
        ]
      }
    ];

    await Lead.insertMany(leads);
    console.log(`📊 ${leads.length} sample leads seeded`);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

module.exports = seedDatabase;
