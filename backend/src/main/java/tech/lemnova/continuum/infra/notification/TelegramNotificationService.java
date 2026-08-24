package tech.lemnova.continuum.infra.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.http.HttpClient;
import java.time.Instant;

/**
 * Bot #1 — product/business notifications (new signups).
 * Configure with TELEGRAM_NEWUSER_BOT_TOKEN + TELEGRAM_NEWUSER_CHAT_ID.
 */
@Service
public class TelegramNotificationService {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotificationService.class);

    private final TelegramBotClient bot;

    @Autowired
    public TelegramNotificationService(
            @Value("${telegram.newuser.bot-token:${TELEGRAM_NEWUSER_BOT_TOKEN:}}") String botToken,
            @Value("${telegram.newuser.chat-id:${TELEGRAM_NEWUSER_CHAT_ID:}}") String chatId) {
        this(new TelegramBotClient(botToken, chatId));
    }

    public TelegramNotificationService(String botToken, String chatId, HttpClient httpClient) {
        this(new TelegramBotClient(botToken, chatId, httpClient));
    }

    TelegramNotificationService(TelegramBotClient bot) {
        this.bot = bot;
    }

    public void notifyNewUser(String name, String email) {
        if (!bot.isConfigured()) {
            log.warn("Telegram new-user bot not configured (TELEGRAM_NEWUSER_BOT_TOKEN / TELEGRAM_NEWUSER_CHAT_ID). Skipping notification for {} <{}>", name, email);
            return;
        }

        String message = "🎉 <b>Novo usuário</b>\n"
                + "👤 " + TelegramBotClient.escapeHtml(name) + "\n"
                + "✉️ " + TelegramBotClient.escapeHtml(email) + "\n"
                + "🕒 " + Instant.now();

        bot.sendMessage(message, (status, body) ->
                log.error("Falha ao enviar notificação Telegram (novo usuário {} <{}>): status={} body={}", name, email, status, body));
    }
}
