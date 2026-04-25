package smart_campus.back_end.tickets.service;

import smart_campus.back_end.tickets.dto.CommentDTO;
import java.util.List;

public interface CommentService {
    CommentDTO addComment(CommentDTO commentDTO);
    List<CommentDTO> getCommentsByTicketId(String ticketId);
    CommentDTO updateComment(String id, String userEmail, String newContent);
    void deleteComment(String id, String userEmail);
}
