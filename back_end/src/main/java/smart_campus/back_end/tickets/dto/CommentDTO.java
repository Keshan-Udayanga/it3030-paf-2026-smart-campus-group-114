package smart_campus.back_end.tickets.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    private String id;
    private String ticketId;
    private String authorName;
    private String authorEmail;
    private String content;
    private LocalDateTime createdAt;

    public CommentDTO() {
    }

    public CommentDTO(String id, String ticketId, String authorName, String authorEmail, String content, LocalDateTime createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.content = content;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
