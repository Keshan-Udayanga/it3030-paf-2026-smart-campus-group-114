package smart_campus.back_end.tickets.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smart_campus.back_end.auth.model.User;
import smart_campus.back_end.auth.service.UserService;
import smart_campus.back_end.notification.service.NotificationService;
import smart_campus.back_end.tickets.dto.CommentDTO;
import smart_campus.back_end.tickets.dto.TicketResponseDTO;
import smart_campus.back_end.tickets.entity.Comment;
import smart_campus.back_end.tickets.entity.Ticket;
import smart_campus.back_end.tickets.repository.CommentRepository;
import smart_campus.back_end.tickets.service.CommentService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TicketServiceImpl ticketService;

    @Override
    public CommentDTO addComment(CommentDTO commentDTO, String userId) {
        Comment comment = new Comment(
                commentDTO.getTicketId(),
                commentDTO.getAuthorName(),
                commentDTO.getAuthorEmail(),
                commentDTO.getContent()
        );
        Comment savedComment = commentRepository.save(comment);

        //Notification Implementation
        TicketResponseDTO ticket = ticketService.getTicketById(commentDTO.getTicketId());
        User createdBy = userService.findById(ticket.getCreatedBy());

        if(createdBy.getId().equals(userId)){
            //Notification Implementations
            List<User> managers = userService.getUsersByRole("ROLE_RESOURCE_MANAGER");
            List<User> admins = userService.getUsersByRole("ROLE_ADMIN");

            String message = "New comment was added. TicketCode: " + ticket.getTicketCode();

            managers.forEach(u ->
                    notificationService.createNotification(u.getId(), message, "COMMENT")
            );

            admins.forEach(u ->
                    notificationService.createNotification(u.getId(), message, "COMMENT")
            );
        }else{
            String message = "New comment was added. TicketCode: " + ticket.getTicketCode();
            notificationService.createNotification(userId, message, "COMMENT");
        }

        return mapToDTO(savedComment);
    }

    @Override
    public List<CommentDTO> getCommentsByTicketId(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO updateComment(String id, String userEmail, String newContent) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Ownership rule: Only author can edit
        if (!comment.getAuthorEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to edit this comment");
        }

        comment.setContent(newContent);
        comment.setUpdatedAt(LocalDateTime.now());
        Comment updatedComment = commentRepository.save(comment);
        return mapToDTO(updatedComment);
    }

    @Override
    public void deleteComment(String id, String userEmail) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Ownership rule: Only author can delete
        if (!comment.getAuthorEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepository.deleteById(id);
    }

    private CommentDTO mapToDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getTicketId(),
                comment.getAuthorName(),
                comment.getAuthorEmail(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
