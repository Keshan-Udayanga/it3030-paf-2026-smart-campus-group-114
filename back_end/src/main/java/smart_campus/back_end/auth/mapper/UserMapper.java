package smart_campus.back_end.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import smart_campus.back_end.auth.dto.UserResponse;
import smart_campus.back_end.auth.model.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "enabled", source = "enabled") // FORCE mapping
    UserResponse toUserResponse(User user);
    List<UserResponse> toUserResponse(List<User> user);
}
