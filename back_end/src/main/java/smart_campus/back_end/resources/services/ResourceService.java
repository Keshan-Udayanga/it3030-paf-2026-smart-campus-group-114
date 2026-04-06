package smart_campus.back_end.resources.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import smart_campus.back_end.resources.mapper.ResourceMapper;
import smart_campus.back_end.resources.model.Resource;
import smart_campus.back_end.resources.repository.ResourceRepository;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper mapper;

    // save resource
    public ResourceDTO save(ResourceDTO dto) {
        Resource r = mapper.toEntity(dto);
        Resource saved = resourceRepository.save(r);
        return mapper.toDTO(saved);
    }

    // get all resources
    public List<ResourceDTO> getAll() {
        return resourceRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // get by id
    public ResourceDTO getById(String id) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        return mapper.toDTO(r);
    }

    // check availability (time-based)
    public boolean isAvailable(String id, LocalTime from, LocalTime to) {
        Resource r = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        return !r.getAvailableFrom().isAfter(from) &&
                !r.getAvailableTo().isBefore(to) &&
                r.getStatus().equals("ACTIVE");
    }
}
