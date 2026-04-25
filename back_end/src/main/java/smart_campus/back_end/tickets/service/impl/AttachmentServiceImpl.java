package smart_campus.back_end.tickets.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import smart_campus.back_end.tickets.entity.Attachment;
import smart_campus.back_end.tickets.entity.Ticket;
import smart_campus.back_end.tickets.repository.AttachmentRepository;
import smart_campus.back_end.tickets.repository.TicketRepository;
import smart_campus.back_end.tickets.service.AttachmentService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    private static final int MAX_ATTACHMENTS = 3;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public List<Attachment> uploadAttachments(String ticketId, List<MultipartFile> files) throws IOException {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        List<String> existingIds = ticket.getAttachmentIds();
        if (existingIds == null) {
            existingIds = new ArrayList<>();
        }

        int slotsLeft = MAX_ATTACHMENTS - existingIds.size();
        if (slotsLeft <= 0) {
            throw new RuntimeException("Maximum of " + MAX_ATTACHMENTS + " attachments already reached.");
        }

        List<Attachment> savedAttachments = new ArrayList<>();
        int count = 0;
        for (MultipartFile file : files) {
            if (count >= slotsLeft) break;

            Attachment attachment = new Attachment(
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes()
            );
            Attachment saved = attachmentRepository.save(attachment);
            savedAttachments.add(saved);
            count++;
        }

        List<String> newIds = savedAttachments.stream()
                .map(Attachment::getId)
                .toList();

        existingIds.addAll(newIds);
        ticket.setAttachmentIds(existingIds);
        ticketRepository.save(ticket);

        return savedAttachments;
    }

    @Override
    public Attachment getAttachment(String attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found: " + attachmentId));
    }
}
