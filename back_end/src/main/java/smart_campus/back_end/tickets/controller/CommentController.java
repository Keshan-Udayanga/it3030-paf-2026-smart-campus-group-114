package smart_campus.back_end.tickets.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.tickets.dto.CommentDTO;
import smart_campus.back_end.tickets.service.CommentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> addComment(@RequestBody CommentDTO commentDTO) {
        return new ResponseEntity<>(commentService.addComment(commentDTO), HttpStatus.CREATED);
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTicketId(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicketId(ticketId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        
        String email = payload.get("email");
        String content = payload.get("content");
        
        if (email == null || content == null) {
            return ResponseEntity.badRequest().body("Email and content are required");
        }
        
        try {
            return ResponseEntity.ok(commentService.updateComment(id, email, content));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String id,
            @RequestParam String email) {
        
        try {
            commentService.deleteComment(id, email);
            return ResponseEntity.ok().body("Comment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
