package smart_campus.back_end.resources.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import smart_campus.back_end.resources.mapper.ResourceMapper;
import smart_campus.back_end.resources.model.Resource;
import smart_campus.back_end.resources.repository.ResourceRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServices{

    private final ResourceRepository resourceRepo;
    private final ResourceMapper resourceMapper;

    // save resources
    public ResourceDTO saveResources(ResourceDTO dto){
        Resource r = resourceMapper.toEntity(dto);
        Resource saved = resourceRepo.save(r);
        return resourceMapper.toDTO(saved);
    }

    // get all resources
    public List<ResourceDTO> getAllResources() {
        return resourceRepo.findAll()
                .stream()
                .map(resourceMapper::toDTO)
                .collect(Collectors.toList());
    }

    // get resources by ID
    public ResourceDTO getResourceById(String id) {
        Resource resource = resourceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        return resourceMapper.toDTO(resource);
    }


}
