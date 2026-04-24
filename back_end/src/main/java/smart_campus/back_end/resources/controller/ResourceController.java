package smart_campus.back_end.resources.controller;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;
import smart_campus.back_end.resources.DTO.ResourceDTO;
import smart_campus.back_end.resources.services.ResourceServices;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/resources")
public class ResourceController {

    private final ResourceServices services;

    public ResourceController(ResourceServices services) {
        this.services = services;
    }

    @PostMapping("/add")
    public ResourceDTO addResource(@RequestBody ResourceDTO resourceDTO){
        System.out.println(resourceDTO);
        return services.addResources(resourceDTO);
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


    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable String id) {
        services.deleteResource(id);
        return "Deleted successfully";
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResourceDTO updateResource(
            @PathVariable String id,
            @RequestBody ResourceDTO resourceDTO
    ) {
        return services.updateResource(id, resourceDTO);
    }
}
