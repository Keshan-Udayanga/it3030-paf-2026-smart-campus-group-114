package smart_campus.back_end.tickets.dto;

/**
 * DTO for returning attachment metadata in API responses.
 * Does NOT include binary data (byte[]) to keep responses lightweight.
 * Use the download endpoint to get the actual file.
 */
public class AttachmentDTO {

    private String id;
    private String fileName;
    private String fileType;
    private String downloadUrl;

    public AttachmentDTO() {
    }

    public AttachmentDTO(String id, String fileName, String fileType, String downloadUrl) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.downloadUrl = downloadUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }
}
