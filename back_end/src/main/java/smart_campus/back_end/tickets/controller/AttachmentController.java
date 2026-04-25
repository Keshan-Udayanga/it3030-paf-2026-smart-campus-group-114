package smart_campus.back_end.tickets.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import smart_campus.back_end.tickets.entity.Attachment;
import smart_campus.back_end.tickets.service.AttachmentService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    /**
     * POST /api/v1/tickets/{ticketId}/attachments
     * Upload up to 3 files for a given ticket.
     * Frontend sends: multipart/form-data with key "files"
     */
    @PostMapping("/{ticketId}/attachments")
    public ResponseEntity<?> uploadAttachments(
            @PathVariable String ticketId,
            @RequestParam("files") List<MultipartFile> files) {

        if (files.size() > 3) {
            return ResponseEntity.badRequest().body("Maximum 3 attachments allowed per upload.");
        }

        try {
            List<String> savedIds = attachmentService.uploadAttachments(ticketId, files);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedIds);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/v1/tickets/attachments/{attachmentId}
     * Download a single attachment by its ID.
     */
    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable String attachmentId) {
        try {
            Attachment attachment = attachmentService.getAttachment(attachmentId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    attachment.getFileType() != null ? attachment.getFileType() : "application/octet-stream"
            ));
            headers.setContentDispositionFormData("attachment", attachment.getFileName());

            return ResponseEntity.ok().headers(headers).body(attachment.getData());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
