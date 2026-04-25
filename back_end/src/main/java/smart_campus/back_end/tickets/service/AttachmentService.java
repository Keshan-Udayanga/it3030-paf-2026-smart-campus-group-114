package smart_campus.back_end.tickets.service;

import org.springframework.web.multipart.MultipartFile;
import smart_campus.back_end.tickets.entity.Attachment;

import java.io.IOException;
import java.util.List;

public interface AttachmentService {

    /**
     * Upload up to 3 files and link them to the given ticket.
     */
    List<Attachment> uploadAttachments(String ticketId, List<MultipartFile> files) throws IOException;

    /**
     * Download a single attachment by its MongoDB ID.
     */
    Attachment getAttachment(String attachmentId);
}
