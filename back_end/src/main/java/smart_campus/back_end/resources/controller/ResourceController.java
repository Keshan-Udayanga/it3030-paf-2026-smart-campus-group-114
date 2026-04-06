package smart_campus.back_end.resources.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.*;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import smart_campus.back_end.resources.services.ResourceService;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService service;

    // create resource
    @PostMapping
    public EntityModel<ResourceDTO> createResource(@RequestBody ResourceDTO dto) {
        ResourceDTO saved = service.save(dto);
        return EntityModel.of(saved,
                linkTo(methodOn(ResourceController.class).getResourceById(saved.getId())).withSelfRel());
    }

    // get all
    @GetMapping
    public CollectionModel<EntityModel<ResourceDTO>> getAllResources() {
        List<EntityModel<ResourceDTO>> resources = service.getAll()
                .stream()
                .map(dto -> EntityModel.of(dto,
                        linkTo(methodOn(ResourceController.class).getResourceById(dto.getId())).withSelfRel()))
                .collect(Collectors.toList());

        return CollectionModel.of(resources,
                linkTo(methodOn(ResourceController.class).getAllResources()).withSelfRel());
    }

    // get by id
    @GetMapping("/{id}")
    public EntityModel<ResourceDTO> getResourceById(@PathVariable String id) {
        ResourceDTO dto = service.getById(id);
        return EntityModel.of(dto,
                linkTo(methodOn(ResourceController.class).getResourceById(id)).withSelfRel());
    }

    // check availability
    @GetMapping("/{id}/check-availability")
    public Map<String, Object> checkAvailability(@PathVariable String id,
                                                 @RequestParam String from,
                                                 @RequestParam String to) {
        LocalTime fromTime = LocalTime.parse(from);
        LocalTime toTime = LocalTime.parse(to);
        boolean available = service.isAvailable(id, fromTime, toTime);

        return Map.of(
                "resourceId", id,
                "available", available
        );
    }
}