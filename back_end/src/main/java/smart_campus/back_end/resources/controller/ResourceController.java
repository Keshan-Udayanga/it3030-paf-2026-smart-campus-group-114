package smart_campus.back_end.resources.controller;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import smart_campus.back_end.resources.services.ResourceServices;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/resources")
public class ResourceController {

    private final ResourceServices services;

    public ResourceController(ResourceServices services) {
        this.services = services;
    }

    // get all resources details
    @GetMapping
    public List<EntityModel<ResourceDTO>> getAllResources(){
        return services.getAllResources()
                .stream()
                .map(resource -> EntityModel.of(resource,
                        linkTo(methodOn(ResourceController.class)
                                .getResourceById(resource.getId())).withSelfRel()
                ))
                .toList();
    }

    // optional (needed for proper self links)
    @GetMapping("/{id}")
    public ResourceDTO getResourceById(@PathVariable("id") String id){
        return services.getResourceById(id);
    }
    
}
