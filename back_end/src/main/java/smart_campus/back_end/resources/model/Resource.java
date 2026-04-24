package smart_campus.back_end.resources.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;
    private String name;
    private String type;
    private int capacity;
    private String location;
    private String status; // ACTIVE / OUT_OF_SERVICE


}
