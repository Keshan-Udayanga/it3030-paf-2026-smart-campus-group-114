package smart_campus.back_end.resources.mapper;


import smart_campus.back_end.resources.model.Resource;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

    public ResourceDTO toDTO(Resource r) {
        return ResourceDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .type(r.getType())
                .capacity(r.getCapacity())
                .location(r.getLocation())
                .status(r.getStatus())
                .availableFrom(r.getAvailableFrom())
                .availableTo(r.getAvailableTo())
                .build();
    }

    public Resource toEntity(ResourceDTO dto) {
        return Resource.builder()
                .id(dto.getId())
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .status(dto.getStatus())
                .availableFrom(dto.getAvailableFrom())
                .availableTo(dto.getAvailableTo())
                .build();
    }
}