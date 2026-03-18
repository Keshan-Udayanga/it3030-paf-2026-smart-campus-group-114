package smart_campus.back_end.auth.mapper;

import org.mapstruct.Mapper;
import smart_campus.back_end.auth.dto.UserResponse;
import smart_campus.back_end.auth.model.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(User user);
    List<UserResponse> toUserResponse(List<User> user);
}
