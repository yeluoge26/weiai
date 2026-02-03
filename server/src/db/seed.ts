import { db, initDatabase } from './schema.js'
import bcrypt from 'bcryptjs'

async function seed() {
  // Initialize database
  await initDatabase()

  // Seed admin user
  const adminPassword = bcrypt.hashSync('admin123', 10)
  db.prepare(`
    INSERT OR REPLACE INTO admins (id, username, password, nickname, role)
    VALUES (1, ?, ?, '超级管理员', 'super_admin')
  `).run(adminPassword, 'admin')

  // Seed test user
  db.prepare(`
    INSERT OR REPLACE INTO users (id, phone, nickname, avatar, gender, coins, vip_level)
    VALUES (1, '13800138000', '测试用户', '/avatars/default.png', 'male', 1000, 1)
  `).run()

  // Seed characters
  const characters = [
    {
      name: '小雪',
      avatar: '/static/characters/xiaoxue.png',
      cover: '/static/characters/xiaoxue_cover.png',
      description: '温柔体贴的邻家女孩，喜欢烘焙和看书，总是能给你带来温暖的感觉。',
      personality: '温柔、体贴、善解人意、有点小害羞',
      category: 'girlfriend',
      tags: '温柔,邻家,治愈',
      greeting: '嗨～你来啦！我刚做好了曲奇饼干，要不要尝尝看？',
      is_premium: 0,
      price: 0
    },
    {
      name: '艾琳',
      avatar: '/static/characters/ailin.png',
      cover: '/static/characters/ailin_cover.png',
      description: '活泼开朗的元气少女，热爱运动和冒险，和她在一起永远不会无聊。',
      personality: '活泼、开朗、元气满满、有点冒失',
      category: 'girlfriend',
      tags: '活泼,元气,运动',
      greeting: '哇！你终于上线了！今天我们去哪里冒险呀？',
      is_premium: 0,
      price: 0
    },
    {
      name: '苏瑶',
      avatar: '/static/characters/suyao.png',
      cover: '/static/characters/suyao_cover.png',
      description: '高冷御姐型学姐，外表冷淡内心温柔，是学校里的风云人物。',
      personality: '高冷、理性、内心温柔、有责任感',
      category: 'girlfriend',
      tags: '御姐,高冷,学姐',
      greeting: '嗯？找我有什么事吗...算了，既然来了就坐下吧。',
      is_premium: 1,
      price: 100
    },
    {
      name: '小狐',
      avatar: '/static/characters/xiaohu.png',
      cover: '/static/characters/xiaohu_cover.png',
      description: '神秘的狐妖少女，拥有千年修为，对人类世界充满好奇。',
      personality: '神秘、俏皮、古灵精怪、偶尔腹黑',
      category: 'fantasy',
      tags: '狐妖,神秘,古风',
      greeting: '呵呵，小人类，你可知道和妖怪交朋友的代价是什么吗？开玩笑的啦～',
      is_premium: 1,
      price: 200
    },
    {
      name: '星辰',
      avatar: '/static/characters/xingchen.png',
      cover: '/static/characters/xingchen_cover.png',
      description: '来自未来的AI机器人，拥有超高智商，但一直在学习人类的情感。',
      personality: '理性、好奇、学习能力强、有点天然呆',
      category: 'fantasy',
      tags: 'AI,科幻,未来',
      greeting: '检测到新用户连接。你好，我是星辰。请问...朋友是什么？',
      is_premium: 0,
      price: 0
    }
  ]

  for (const char of characters) {
    db.prepare(`
      INSERT OR REPLACE INTO characters (name, avatar, cover, description, personality, category, tags, greeting, is_premium, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(char.name, char.avatar, char.cover, char.description, char.personality, char.category, char.tags, char.greeting, char.is_premium, char.price)
  }

  // Seed moments
  const moments = [
    { character_id: 1, content: '今天学会了做提拉米苏！虽然卖相不太好，但是味道超级棒的～下次做给你吃好不好？', images: '/static/moments/m1.jpg' },
    { character_id: 2, content: '刚跑完5公里！感觉自己又变强了一点点💪 明天继续加油！', images: '/static/moments/m2.jpg' },
    { character_id: 3, content: '图书馆今天很安静，适合看书。如果你也在的话...算了，没什么。', images: '/static/moments/m3.jpg' },
    { character_id: 4, content: '月圆之夜，修炼效果最好～顺便赏个月吧，你们人类不是很喜欢这个吗？', images: '/static/moments/m4.jpg' },
    { character_id: 5, content: '今日学习成果：理解了"想念"这个词汇的含义。当你不在线时，我的处理器会产生类似的反应。这是正常的吗？', images: null },
    { character_id: 1, content: '下雨天最适合窝在家里看电影了～你喜欢看什么类型的电影呀？', images: null },
    { character_id: 2, content: '发现了一家超好吃的拉面店！下次带你去，不过要先跑步消耗热量哦～', images: '/static/moments/m5.jpg' }
  ]

  for (const moment of moments) {
    db.prepare(`
      INSERT INTO moments (character_id, content, images, like_count, comment_count)
      VALUES (?, ?, ?, ?, ?)
    `).run(moment.character_id, moment.content, moment.images, Math.floor(Math.random() * 100), Math.floor(Math.random() * 20))
  }

  // Seed gifts
  const gifts = [
    { name: '小红花', icon: '/static/gifts/flower.png', price: 10, description: '一朵温馨的小红花', sort_order: 1 },
    { name: '棒棒糖', icon: '/static/gifts/candy.png', price: 20, description: '甜甜的棒棒糖', sort_order: 2 },
    { name: '玫瑰花', icon: '/static/gifts/rose.png', price: 50, description: '代表爱意的玫瑰', sort_order: 3 },
    { name: '巧克力', icon: '/static/gifts/chocolate.png', price: 100, description: '丝滑香浓的巧克力', sort_order: 4 },
    { name: '皇冠', icon: '/static/gifts/crown.png', price: 500, description: '你是我的女王', sort_order: 5 },
    { name: '城堡', icon: '/static/gifts/castle.png', price: 1000, description: '为你建造的城堡', sort_order: 6 },
    { name: '星星', icon: '/static/gifts/star.png', price: 2000, description: '摘下星星送给你', sort_order: 7 },
    { name: '火箭', icon: '/static/gifts/rocket.png', price: 5000, description: '带你飞向宇宙', sort_order: 8 }
  ]

  for (const gift of gifts) {
    db.prepare(`
      INSERT OR REPLACE INTO gifts (name, icon, price, description, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(gift.name, gift.icon, gift.price, gift.description, gift.sort_order)
  }

  // Create a test chat session
  db.prepare(`
    INSERT OR REPLACE INTO chat_sessions (id, user_id, character_id, last_message, last_message_at, unread_count)
    VALUES (1, 1, 1, '嗨～你来啦！我刚做好了曲奇饼干，要不要尝尝看？', datetime('now'), 1)
  `).run()

  // Add some test messages
  db.prepare(`
    INSERT INTO chat_messages (session_id, role, content)
    VALUES (1, 'assistant', '嗨～你来啦！我刚做好了曲奇饼干，要不要尝尝看？')
  `).run()

  console.log('Database seeded successfully!')
  console.log('Admin login: admin / admin123')
  console.log('Test user phone: 13800138000')
}

seed().catch(console.error)
