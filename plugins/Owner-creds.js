import axios from 'axios';

const handler = async (m, { args, conn }) => {
    if (!args[0]) return m.reply("🚫 *يرجى إدخال رقم هاتفك مع رمز الدولة!*");

    const phoneNumber = args[0].replace(/\D/g, ""); // إزالة أي رموز غير رقمية

    if (phoneNumber.length < 11) return m.reply("❌ *يرجى إدخال رقم هاتف صحيح!*");

    try {
        // جلب الصفحة الرئيسية لاستخراج ID
        const response = await axios.get("https://pair.nexusteam.tech/");
        const match = response.data.match(/<input type="hidden" id="id" name="id" value="(.+?)">/);

        if (!match) return m.reply("❌ *لم يتم العثور على معرف الجلسة ID!*");

        const id = match[1];

        // إرسال الطلب للحصول على كود الربط
        const pairResponse = await axios.post("https://pair.nexusteam.tech/code", {
            number: phoneNumber,
            id: id
        });

        if (pairResponse.data.code) {
            await conn.sendMessage(m.chat, { 
                text: `✅ *تم إنشاء كود الربط بنجاح!*\n\n🔢 *الكود:* ${pairResponse.data.code}`,
                contextInfo: { forwardingScore: 999, isForwarded: true }
            }, { quoted: m });
        } else {
            m.reply("❌ *فشل الحصول على كود الربط، يرجى المحاولة لاحقًا!*");
        }
    } catch (error) {
        m.reply(`❌ *حدث خطأ أثناء جلب كود الربط!*\n📌 *التفاصيل:* ${error.message}`);
    }
};

handler.command = ['pair'];
export default handler;