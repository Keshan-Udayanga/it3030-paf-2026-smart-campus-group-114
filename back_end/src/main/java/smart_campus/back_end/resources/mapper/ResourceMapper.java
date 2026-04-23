package smart_campus.back_end.resources.mapper;

import org.springframework.stereotype.Component;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import smart_campus.back_end.resources.model.Resource;

@Component
public class ResourceMapper {
    public Resource toEntity(ResourceDTO dto) {
        return Resource.builder()
                .id(dto.getId())
                .name(dto.getName())
                .type(dto.getType())
                .status(dto.getStatus())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .build();
    }

    public ResourceDTO toDTO(Resource r) {
        return ResourceDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .type(r.getType())
                .capacity(r.getCapacity())
                .location(r.getLocation())
                .status(r.getStatus())
                .build();
    }
}
